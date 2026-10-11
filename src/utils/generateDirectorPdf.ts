import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (status: string) => void;
}

/**
 * Convierte una URL de imagen a Data URL base64 usando canvas / fetch / Image
 * para garantizar que html2canvas no sufra bloqueos de CORS ni manche el canvas (canvas tainting).
 */
async function imageToDataUrl(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:')) return src;

  // Intento 1: Si la imagen ya está cargada en el DOM, dibujarla directamente en canvas
  try {
    const existingImgs = Array.from(document.querySelectorAll('img'));
    const matched = existingImgs.find(i => i.src === src && i.complete && i.naturalWidth > 0);
    if (matched) {
      const cvs = document.createElement('canvas');
      cvs.width = matched.naturalWidth;
      cvs.height = matched.naturalHeight;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.drawImage(matched, 0, 0);
        const dataUrl = cvs.toDataURL('image/png');
        if (dataUrl && dataUrl.length > 200) {
          return dataUrl;
        }
      }
    }
  } catch {
    // Si la captura directa da error de origen, se intenta fetch o Image con CORS
  }

  // Intento 2: Fetch directo con mode cors
  try {
    const res = await fetch(src, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      return await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }
  } catch {
    // ignora error
  }

  // Intento 3: Elemento HTMLImageElement con crossOrigin = 'anonymous'
  try {
    const dataUrl = await new Promise<string | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const cvs = document.createElement('canvas');
          cvs.width = img.naturalWidth || 300;
          cvs.height = img.naturalHeight || 300;
          const ctx = cvs.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(cvs.toDataURL('image/jpeg', 0.95));
            return;
          }
        } catch {
          // ignore
        }
        resolve(null);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
    if (dataUrl) return dataUrl;
  } catch {
    // ignore
  }

  return null;
}

/**
 * Genera un archivo PDF oficial institucional de alta resolución a partir del
 * elemento HTML de la Previsualización de Impresión del Expediente Biográfico.
 */
export async function generateDirectorPdf(
  elementId: string = 'director-printable-document',
  options: GeneratePdfOptions = {}
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF generation.`);
    return false;
  }

  const images = Array.from(element.querySelectorAll('img'));
  const originalSrcs = new Map<HTMLImageElement, string>();

  try {
    options.onProgress?.('Preparando documento e imágenes oficiales...');

    // Convertir imágenes a Data URLs para evitar bloqueos
    for (const img of images) {
      originalSrcs.set(img, img.src);
      if (img.src && !img.src.startsWith('data:')) {
        const dataUrl = await imageToDataUrl(img.src);
        if (dataUrl) {
          img.src = dataUrl;
        }
      }

      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 500);
        });
      }
    }

    options.onProgress?.('Renderizando gráficos y texto en alta definición...');

    // Asegurar que html2canvas capture desde el origen (0,0) sin desfases de scroll
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        const clonedElem = clonedDoc.getElementById(elementId);
        if (clonedElem) {
          // Asegurar visibilidad total de todos los ancestros en el clon
          clonedDoc.body.style.overflow = 'visible';
          clonedDoc.body.style.height = 'auto';

          let curr: HTMLElement | null = clonedElem;
          while (curr && curr !== clonedDoc.body) {
            curr.style.visibility = 'visible';
            curr.style.opacity = '1';
            curr.style.display = 'block';
            curr.style.overflow = 'visible';
            curr.style.maxHeight = 'none';
            curr.style.height = 'auto';
            curr = curr.parentElement;
          }

          // Estilo del elemento contenedor a capturar
          clonedElem.style.display = 'block';
          clonedElem.style.visibility = 'visible';
          clonedElem.style.opacity = '1';
          clonedElem.style.maxHeight = 'none';
          clonedElem.style.height = 'auto';
          clonedElem.style.overflow = 'visible';
          clonedElem.style.boxShadow = 'none';
          clonedElem.style.borderRadius = '0';
          clonedElem.style.border = 'none';
          clonedElem.style.padding = '32px';
          clonedElem.style.margin = '0 auto';
          clonedElem.style.backgroundColor = '#ffffff';
          clonedElem.style.color = '#0f172a';
          clonedElem.style.width = '800px';

          // Forzar visibilidad y opacidad en todos los elementos hijos
          const allDescendants = Array.from(clonedElem.querySelectorAll('*')) as HTMLElement[];
          for (const el of allDescendants) {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
        }
      }
    });

    options.onProgress?.('Estructurando documento PDF A4...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const marginMm = 8;
    const contentWidthMm = pageWidthMm - marginMm * 2; // 194 mm
    const contentHeightMm = pageHeightMm - marginMm * 2; // 281 mm

    const canvasWidthPx = canvas.width;
    const canvasHeightPx = canvas.height;

    // Altura en píxeles de canvas correspondiente a 1 página A4
    const pageCanvasHeightPx = Math.floor((canvasWidthPx * contentHeightMm) / contentWidthMm);

    let renderedHeightPx = 0;
    let pageIndex = 0;
    const totalPages = Math.max(1, Math.ceil(canvasHeightPx / pageCanvasHeightPx));

    while (renderedHeightPx < canvasHeightPx) {
      if (pageIndex > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const currentSliceHeightPx = Math.min(pageCanvasHeightPx, canvasHeightPx - renderedHeightPx);

      // Canvas para el fragmento de la página actual
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidthPx;
      pageCanvas.height = currentSliceHeightPx;
      const pageCtx = pageCanvas.getContext('2d');

      if (pageCtx) {
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0,
          renderedHeightPx,
          canvasWidthPx,
          currentSliceHeightPx,
          0,
          0,
          canvasWidthPx,
          currentSliceHeightPx
        );

        let pageImgData: string;
        try {
          pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        } catch {
          pageImgData = pageCanvas.toDataURL('image/png');
        }

        const renderedHeightMm = (currentSliceHeightPx * contentWidthMm) / canvasWidthPx;

        pdf.addImage(
          pageImgData,
          'JPEG',
          marginMm,
          marginMm,
          contentWidthMm,
          renderedHeightMm,
          undefined,
          'FAST'
        );
      }

      // Pie de página institucional oficial
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `República Dominicana • Ministerio de Defensa • PECPFFAA • Expediente Biográfico Oficial — Pág. ${pageIndex + 1} de ${totalPages}`,
        pageWidthMm / 2,
        pageHeightMm - 3.5,
        { align: 'center' }
      );

      renderedHeightPx += currentSliceHeightPx;
      pageIndex++;
    }

    options.onProgress?.('Descargando archivo PDF oficial...');

    const defaultFileName = options.fileName || 'Expediente_Biografico_Director_General_PECPFFAA.pdf';
    pdf.save(defaultFileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  } finally {
    // Restaurar las fuentes originales de imágenes
    for (const [img, originalSrc] of originalSrcs.entries()) {
      img.src = originalSrc;
    }
  }
}
