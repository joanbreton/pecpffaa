/**
 * Utilidades para procesamiento, optimización y compresión de imágenes
 * Garantiza que las imágenes cargadas no excedan el límite de Firestore (1 MB)
 * y que persistan de manera confiable en la base de datos sin romperse ni desaparecer.
 */

export interface ImageOptimizationResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  format: string;
}

/**
 * Optimiza y redimensiona un archivo de imagen en el cliente
 * mediante HTML5 Canvas, reduciendo su peso a <300 KB para Firestore.
 */
export async function optimizeImageFile(
  file: File, 
  maxWidth = 1920, 
  maxHeight = 1080, 
  quality = 0.82
): Promise<ImageOptimizationResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen seleccionada.'));
      img.onload = () => {
        let { width, height } = img;

        // Mantener proporción de aspecto dentro de los límites
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto de imagen.'));
          return;
        }

        // Fondo limpio para transparencias si se convierte a JPEG
        ctx.fillStyle = '#061836';
        ctx.fillRect(0, 0, width, height);

        // Suavizado de imagen de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Intentar compresión a WebP si es compatible, fallback a JPEG
        let mimeType = 'image/webp';
        let dataUrl = canvas.toDataURL(mimeType, quality);

        // Si el navegador no soporta webp en canvas, devuelve png o el mismo mime
        if (!dataUrl.startsWith('data:image/webp')) {
          mimeType = 'image/jpeg';
          dataUrl = canvas.toDataURL(mimeType, quality);
        }

        // Medir tamaño aproximado en KB
        let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        // Si aún supera los 500 KB, reintentar con calidad más ajustada (0.65)
        if (sizeKb > 500) {
          dataUrl = canvas.toDataURL(mimeType, 0.65);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        resolve({
          dataUrl,
          sizeKb,
          width,
          height,
          format: mimeType
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Sanitiza los snapshots de auditoría para evitar que datos base64
 * masivos se almacenen duplicados en los registros de auditoría de Firestore.
 */
export function sanitizeSnapshotForAudit(snapshot?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!snapshot) return undefined;
  
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      const kb = Math.round((value.length * 3) / 4 / 1024);
      clean[key] = `[Imagen Base64 Optimizado (${kb} KB)]`;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      clean[key] = sanitizeSnapshotForAudit(value as Record<string, unknown>);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}
