/** @format */

const tailwindSpectrumColorFormat = require('./formats/tailwindSpectrumColorFormat');
const tailwindBackgroundColorFormat = require('./formats/tailwindBackgroundColorFormat');
const tailwindBorderColorFormat = require('./formats/tailwindBorderColorFormat');
const tailwindTextColorFormat = require('./formats/tailwindTextColorFormat');

module.exports = {
  format: {
    // Transforming colors to a tailwind.config.js color Object
    tailwindSpectrumColorFormat,
    tailwindBackgroundColorFormat,
    tailwindBorderColorFormat,
    tailwindTextColorFormat,
  },

  source: ['tokens/**/*.json'],
  platforms: {
    json: {
      buildPath: 'output/',
      transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
      files: [
        {
          destination: 'tokens.json',
          format: 'json',
        },
      ],
    },
    spectrumColor: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
      files: [
        {
          destination: 'spectrum.tailwind.js',
          format: 'tailwindSpectrumColorFormat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
    backgroundColor: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
      files: [
        {
          destination: 'backgroundcolor.tailwind.js',
          format: 'tailwindBackgroundColorFormat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
    borderColor: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
      files: [
        {
          destination: 'bordercolor.tailwind.js',
          format: 'tailwindBorderColorFormat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
    textColor: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
      files: [
        {
          destination: 'textcolor.tailwind.js',
          format: 'tailwindTextColorFormat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
  },
};
