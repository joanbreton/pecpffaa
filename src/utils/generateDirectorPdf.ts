import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (status: string) => void;
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
    options.onProgress?.('Preparando documento institucional...');

    // Pre-cargar imágenes externas a Data URL para evitar restricciones de CORS
    for (const img of images) {
      originalSrcs.set(img, img.src);
      if (img.src && img.src.startsWith('http') && !img.src.startsWith('data:')) {
        try {
          const res = await fetch(img.src, { mode: 'cors' });
          if (res.ok) {
            const blob = await res.blob();
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = () => resolve(img.src);
              reader.readAsDataURL(blob);
            });
            if (dataUrl && dataUrl.startsWith('data:')) {
              img.src = dataUrl;
            }
          }
        } catch {
          // Si fetch directo falla, html2canvas useCORS lo intentará
        }
      }

      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    }

    options.onProgress?.('Renderizando gráficos y semblanza en alta definición...');

    // Captura en escala 2x para nitidez tipográfica y fotográfica
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
    });

    options.onProgress?.('Estructurando formato A4...');

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

    // Altura en píxeles de canvas correspondiente a una página A4
    const pageCanvasHeightPx = Math.floor((canvasWidthPx * contentHeightMm) / contentWidthMm);

    let renderedHeightPx = 0;
    let pageIndex = 0;
    const totalPages = Math.max(1, Math.ceil(canvasHeightPx / pageCanvasHeightPx));

    while (renderedHeightPx < canvasHeightPx) {
      if (pageIndex > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const currentSliceHeightPx = Math.min(pageCanvasHeightPx, canvasHeightPx - renderedHeightPx);

      // Crear canvas temporal para la página actual
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
          pageImgData = pageCanvas.toDataURL();
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
    // Restaurar imágenes originales
    for (const [img, originalSrc] of originalSrcs.entries()) {
      img.src = originalSrc;
    }
  }
}
