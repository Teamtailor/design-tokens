/** @format */
const StyleDictionaryPackage = require('style-dictionary');
const tailwindSpectrumColorFormat = require('./formats/tailwindSpectrumColorFormat');
const tailwindThemeColorFormat = require('./formats/tailwindThemeColorFormat');

StyleDictionaryPackage.registerFormat({
  name: 'css/variables',
  formatter: function (dictionary, config) {
    return `${this.selector} {\n${dictionary.allProperties
      .map((prop) => `  --${prop.name}: ${prop.value};`)
      .join('\n')}\n}`;
  },
});

const twSpectrumConfig = {
  format: {
    // Transforming colors to a tailwind.config.js color Object
    tailwindSpectrumColorFormat,
  },

  source: ['tokens/spectrum.json'],
  platforms: {
    tailwind: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab'],
      files: [
        {
          destination: 'colors.spectrum.tailwind.js',
          format: 'tailwindSpectrumColorFormat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
  },
};

const twThemeConfig = {
  format: {
    // Transforming colors to a tailwind.config.js color Object
    tailwindThemeColorFormat,
  },
  source: ['tokens/spectrum.json', `tokens/light.json`],
  platforms: {
    tailwind: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab'],
      files: [
        {
          filter: function (token) {
            return token.filePath === `tokens/light.json`;
          },
          destination: `colors.theme.tailwind.js`,
          format: 'tailwindThemeColorFormat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
  },
};

const themeConfig = (theme) => {
  return {
    source: ['tokens/spectrum.json', `tokens/${theme}.json`],
    platforms: {
      theme: {
        transforms: ['attribute/cti', 'name/cti/kebab', 'color/rgb'],
        buildPath: `output/`,
        files: [
          {
            filter: function (token) {
              return token.filePath === `tokens/${theme}.json`;
            },
            destination: `${theme}-theme.css`,
            format: 'css/variables',
            selector: `.${theme}-theme`,
          },
        ],
      },
    },
  };
};

console.log('\n==============================================');
console.log(`\nProcessing: Spectrum`);
const dictionaryTailwindColors =
  StyleDictionaryPackage.extend(twSpectrumConfig);
dictionaryTailwindColors.buildPlatform('tailwind');

console.log(`\nProcessing: Theme`);
const dictionaryTailwindTheme = StyleDictionaryPackage.extend(twThemeConfig);
dictionaryTailwindTheme.buildPlatform('tailwind');

console.log(`\nProcessing: Light`);
const dictionaryLight = StyleDictionaryPackage.extend(themeConfig('light'));
dictionaryLight.buildPlatform('theme');

console.log(`\nProcessing: Dark`);
const dictionaryDark = StyleDictionaryPackage.extend(themeConfig('dark'));
dictionaryDark.buildPlatform('theme');

console.log('\nEnd processing');
