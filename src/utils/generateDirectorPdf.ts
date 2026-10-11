import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (status: string) => void;
}

export interface GeneratePdfResult {
  success: boolean;
  blob?: Blob;
  blobUrl?: string;
  fileName?: string;
}

/**
 * PASO CLAVE 1:
 * Convierte cualquier cadena de color CSS (incluyendo oklch / oklab de Tailwind v4)
 * a una representación estándar rgba(r, g, b, a) usando el contexto de un canvas 2D,
 * evitando que html2canvas lance "unsupported color function oklch".
 */
function colorToRgb(colorStr: string): string {
  if (!colorStr || (!colorStr.includes('oklch') && !colorStr.includes('oklab'))) {
    return colorStr;
  }
  try {
    const cvs = document.createElement('canvas');
    cvs.width = 1;
    cvs.height = 1;
    const ctx = cvs.getContext('2d');
    if (ctx) {
      ctx.fillStyle = colorStr;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
    }
  } catch {
    // Fallback silencioso si falla la conversión directa
  }
  return colorStr;
}

/**
 * PASO CLAVE 2:
 * Convierte una URL de imagen a Data URL base64 usando canvas / fetch / Image
 * para garantizar que html2canvas no sufra bloqueos de CORS ni manche el canvas (canvas tainting).
 */
async function imageToDataUrl(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:')) return src;

  // Intento A: Dibujar directamente si la imagen ya fue cargada por el navegador
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
    // Si la captura directa da error de origen, probar mediante fetch o Image con CORS
  }

  // Intento B: Fetch con modo CORS habilitado
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
    // Continuar al siguiente intento
  }

  // Intento C: Elemento HTMLImageElement con atributo crossOrigin
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
 * PASO CLAVE 3:
 * Captura el contenedor HTML del documento con html2canvas, lo convierte a imagen de alta definición,
 * lo estructura en formato PDF A4 multipágina con jsPDF, genera un objeto Blob / ObjectURL para
 * previsualización o descarga directa, y guarda el archivo en el sistema de archivos del usuario.
 */
export async function generateDirectorPdf(
  elementId: string = 'director-printable-document',
  options: GeneratePdfOptions = {}
): Promise<GeneratePdfResult> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemento con ID "${elementId}" no fue encontrado para la generación de PDF.`);
    return { success: false };
  }

  const images = Array.from(element.querySelectorAll('img'));
  const originalSrcs = new Map<HTMLImageElement, string>();

  try {
    options.onProgress?.('Preparando documento e imágenes oficiales...');

    // Convertir imágenes a Data URLs para evitar bloqueos de CORS
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

    options.onProgress?.('Capturando documento con html2canvas en alta resolución...');

    // PASO CLAVE 4: Capturar contenedor con html2canvas re-posicionando el clon en el origen (0,0)
    const canvas = await html2canvas(element, {
      scale: 2, // Alta definición (2x)
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        const clonedWin = clonedDoc.defaultView || window;
        const clonedElem = clonedDoc.getElementById(elementId);

        if (clonedElem) {
          // Colocar el clon directamente en el body del documento clonado
          // para desvincularlo de overlays o contenedores con scroll modal
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '0';
          clonedDoc.body.style.backgroundColor = '#ffffff';
          clonedDoc.body.style.overflow = 'visible';

          clonedElem.style.position = 'absolute';
          clonedElem.style.top = '0px';
          clonedElem.style.left = '0px';
          clonedElem.style.margin = '0';
          clonedElem.style.padding = '32px';
          clonedElem.style.width = '800px';
          clonedElem.style.maxWidth = '800px';
          clonedElem.style.maxHeight = 'none';
          clonedElem.style.height = 'auto';
          clonedElem.style.overflow = 'visible';
          clonedElem.style.boxShadow = 'none';
          clonedElem.style.borderRadius = '0';
          clonedElem.style.border = 'none';
          clonedElem.style.backgroundColor = '#ffffff';
          clonedElem.style.color = '#0f172a';
          clonedElem.style.transform = 'none';
          clonedElem.style.visibility = 'visible';
          clonedElem.style.opacity = '1';

          // Mover el elemento imprimible directamente al body del clon
          clonedDoc.body.appendChild(clonedElem);

          // PASO CLAVE 5: Sanitizar y convertir cualquier estilo oklch / oklab a rgba en todos los descendientes
          const allDescendants = Array.from(clonedElem.querySelectorAll('*')) as HTMLElement[];
          const colorProperties = [
            'color', 
            'background-color', 
            'border-color', 
            'border-top-color', 
            'border-right-color', 
            'border-bottom-color', 
            'border-left-color', 
            'outline-color'
          ];

          for (const el of allDescendants) {
            try {
              el.style.visibility = 'visible';
              el.style.opacity = '1';

              const comp = clonedWin.getComputedStyle(el);
              for (const prop of colorProperties) {
                const val = comp.getPropertyValue(prop);
                if (val && (val.includes('oklch') || val.includes('oklab'))) {
                  const converted = colorToRgb(val);
                  el.style.setProperty(prop, converted, 'important');
                }
              }

              if (el.style.cssText && (el.style.cssText.includes('oklch') || el.style.cssText.includes('oklab'))) {
                el.style.cssText = el.style.cssText.replace(/oklch\([^)]+\)/g, (match) => colorToRgb(match));
                el.style.cssText = el.style.cssText.replace(/oklab\([^)]+\)/g, (match) => colorToRgb(match));
              }
            } catch {
              // ignore
            }
          }
        }
      }
    });

    options.onProgress?.('Estructurando formato PDF A4 con jsPDF...');

    // PASO CLAVE 6: Crear documento jsPDF en formato A4 vertical
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

    // PASO CLAVE 7: Segmentar el canvas en páginas A4
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

    options.onProgress?.('Generando objeto Blob y descarga del PDF...');

    // PASO CLAVE 8: Generar objeto Blob y ObjectURL para previsualización o descarga
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const defaultFileName = options.fileName || 'Expediente_Biografico_Director_General_PECPFFAA.pdf';

    // Descargar directamente el archivo PDF
    pdf.save(defaultFileName);

    return {
      success: true,
      blob,
      blobUrl,
      fileName: defaultFileName,
    };
  } catch (error) {
    console.error('Error al generar PDF con jsPDF y html2canvas:', error);
    return { success: false };
  } finally {
    // Restaurar las fuentes originales de imágenes en el DOM
    for (const [img, originalSrc] of originalSrcs.entries()) {
      img.src = originalSrc;
    }
  }
}
