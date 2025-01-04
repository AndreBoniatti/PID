function toHex(n: number): string {
  const hex = n.toString(16).toUpperCase();
  return hex.length === 1 ? '0' + hex : hex;
}

function generateRandomHexColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function componentToLinear(component: number): number {
  const srgb = component / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hexColor: string): number {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const rLin = componentToLinear(r);
  const gLin = componentToLinear(g);
  const bLin = componentToLinear(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function getContrastWithWhite(hexColor: string): number {
  const luminance = getRelativeLuminance(hexColor);
  const whiteLuminance = 1;
  return (whiteLuminance + 0.05) / (luminance + 0.05);
}

export function getRandomColorForWhiteText(): string {
  const MIN_CONTRAST = 4.5;

  while (true) {
    const color = generateRandomHexColor();

    if (
      color.toUpperCase() === '#000000' ||
      color.toUpperCase() === '#FFFFFF' ||
      color.toUpperCase() === '#00FF00'
    ) {
      continue;
    }

    const contrast = getContrastWithWhite(color);
    if (contrast >= MIN_CONTRAST) {
      return color;
    }
  }
}

export function getSelectionColor(): string {
  return '#4caf50';
}
