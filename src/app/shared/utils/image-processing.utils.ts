export interface ImageDimensions {
  width: number;
  height: number;
}

export async function validateImageFile(
  file: File,
  allowedTypes: readonly string[],
  maxSizeBytes: number,
  requiredDimensions: ImageDimensions,
): Promise<void> {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`La imagen debe ser ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}.`);
  }

  if (file.size > maxSizeBytes) {
    const maxSizeMB = maxSizeBytes / 1_048_576;
    throw new Error(`La imagen no debe pesar más de ${maxSizeMB} MB.`);
  }

  const dimensions =
    file.type === 'image/svg+xml'
      ? await readSvgDimensions(file)
      : await readImageDimensions(await readFileAsDataUrl(file));

  if (
    dimensions.width !== requiredDimensions.width ||
    dimensions.height !== requiredDimensions.height
  ) {
    throw new Error(`La imagen debe medir exactamente ${requiredDimensions.width} x ${requiredDimensions.height} píxeles.`);
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('No se pudo leer el archivo.'));
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

export function readImageDimensions(
  dataUrl: string,
): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    image.onerror = () =>
      reject(new Error('No se pudo validar la imagen seleccionada.'));
    image.src = dataUrl;
  });
}

export async function readSvgDimensions(
  file: File,
): Promise<ImageDimensions> {
  const svgText = await file.text();
  const document = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = document.documentElement;

  if (svg.nodeName.toLowerCase() !== 'svg') {
    throw new Error('No se pudo validar la imagen seleccionada.');
  }

  const width = parseSvgLength(svg.getAttribute('width'));
  const height = parseSvgLength(svg.getAttribute('height'));

  if (width !== null && height !== null) {
    return { width, height };
  }

  const viewBox = svg.getAttribute('viewBox');
  if (viewBox) {
    const parts = viewBox
      .trim()
      .split(/[,\s]+/)
      .map((value) => Number(value));

    if (
      parts.length === 4 &&
      Number.isFinite(parts[2]) &&
      Number.isFinite(parts[3])
    ) {
      return {
        width: parts[2],
        height: parts[3],
      };
    }
  }

  throw new Error('El archivo SVG debe definir dimensiones válidas.');
}

function parseSvgLength(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const match = value.trim().match(/^([0-9]+(?:\.[0-9]+)?)(px)?$/i);
  if (!match) {
    return null;
  }
  return Number(match[1]);
}
