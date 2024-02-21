export const hexToRgb = (hex: string): number[] => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

export const rgbToHex = (rgb: number[]): string => {
  return `#${((1 << 24) | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2])
    .toString(16)
    .slice(1)}`;
};

export const adjustColor = (channel: number, factor: number): number => {
  return Math.min(255, Math.max(0, Math.round(channel + (255 - channel) * factor)));
};

export const tint = (hexColor: string, factor: number): string => {
  const rgb = hexToRgb(hexColor);
  const tintedRgb = rgb.map(channel => adjustColor(channel, factor));
  return rgbToHex(tintedRgb);
};

export const shade = (hexColor: string, factor: number): string => {
  const rgb = hexToRgb(hexColor);
  const shadedRgb = rgb.map(channel => adjustColor(channel, 1 / factor));
  return rgbToHex(shadedRgb);
};
