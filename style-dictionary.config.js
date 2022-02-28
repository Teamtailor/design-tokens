const tailwindColorFormatRGB = require('./formats/tailwindColorFormatRGB');

module.exports = {
  format: {
    // Transforming colors to a tailwind.config.js color Object
    tailwindColorFormatRGB,
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
    jsCustomColor: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab', 'size/rem'],
      files: [
        {
          destination: 'color.tokens.tailwind.js',
          format: 'tailwindColorFormatRGB',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
  },
};
