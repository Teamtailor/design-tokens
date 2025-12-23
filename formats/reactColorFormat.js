/** @format */

const _ = require('lodash');
const { fileHeader } = require('style-dictionary/lib/common/formatHelpers');
const Color = require('colorjs.io').default;

/**
 * Convert OKLCH color values to hex/rgba for React Native compatibility.
 */
const oklchToHex = (oklchString) => {
  try {
    const color = new Color(oklchString);
    return color.to('srgb').toString({ format: 'hex' });
  } catch (e) {
    return oklchString; // Return original if conversion fails
  }
};

const colorToRgba = (colorString, alpha) => {
  try {
    const color = new Color(colorString);
    const rgb = color.to('srgb');
    const r = Math.round(Math.max(0, Math.min(255, rgb.r * 255)));
    const g = Math.round(Math.max(0, Math.min(255, rgb.g * 255)));
    const b = Math.round(Math.max(0, Math.min(255, rgb.b * 255)));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return colorString;
  }
};

/**
 * Convert any OKLCH value (including relative color syntax) to React Native compatible format
 */
const convertToReactNative = (value) => {
  if (typeof value !== 'string') return value;

  // Handle linear-gradient - convert oklch colors inside but keep as CSS string
  if (value.includes('linear-gradient')) {
    let converted = value;
    // Convert oklch(from ... l c h / alpha) to rgba
    converted = converted.replace(/oklch\(from\s+(.+?)\s+l\s+c\s+h\s*\/\s*([\d.]+)\)/g, (match, baseColor, alpha) => {
      return colorToRgba(baseColor, parseFloat(alpha));
    });
    // Convert simple oklch() to hex
    converted = converted.replace(/oklch\([^)]+\)/g, (match) => oklchToHex(match));
    return converted;
  }

  // Handle relative color syntax: oklch(from <color> l c h / <alpha>)
  const relativeMatch = value.match(/oklch\(from\s+(.+?)\s+l\s+c\s+h\s*\/\s*([\d.]+)\)/);
  if (relativeMatch) {
    const baseColor = relativeMatch[1];
    const alpha = parseFloat(relativeMatch[2]);
    return colorToRgba(baseColor, alpha);
  }

  // Handle simple oklch values
  if (value.startsWith('oklch(')) {
    return oklchToHex(value);
  }

  return value;
};

const reactColorFormat = function ({
  dictionary: { allTokens },
  options: { theme },
  file,
}) {
  const colors = {};

  allTokens.forEach((token) => {
    const { path, value } = token;

    _.setWith(
      colors,
      path.slice(1).map((a) => _.camelCase(a)).join('.'),
      convertToReactNative(value),
      Object
    );
  });

  return (
    fileHeader({ file }) +
    'module.exports' +
    ' = /** @type {const} */ ' +
    JSON.stringify(colors, null, 2) +
    ';'
  );
};

module.exports = reactColorFormat;
