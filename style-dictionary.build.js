/** @format */
const StyleDictionaryPackage = require('style-dictionary');
const tailwindThemeColorFormat = require('./formats/tailwindColorFormat');

StyleDictionaryPackage.registerFormat({
  name: 'css/variables',
  formatter: function (dictionary, config) {
    return `${this.selector} {\n${dictionary.allProperties
      .map((prop) => `  --${prop.name}: ${prop.value};`)
      .join('\n')}\n}`;
  },
});

// Cleans rgb from inside rgba().This is to fix an issue with rgba and variables coming from Figma
// Examples
// rgba(rgb(244, 63, 133), 0.5) -> rgba(244, 63, 133, 0.5)
// linear-gradient(180deg, rgba(rgb(0, 0, 0), 0.02) 2%, rgba(rgb(0, 0, 0), 0.10) 100%) ->
// linear-gradient(180deg, rgba(0, 0, 0, 0.02) 2%, rgba(0, 0, 0, 0.10) 100%)
const cleanRgbFromValue = (value) => {
  const rgx = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
  const cleanValue = value.replace(rgx, '$1,$2,$3');
  if (cleanValue.match(rgx)) {
    return cleanRgbFromValue(cleanValue);
  } else {
    return cleanValue;
  }
};

StyleDictionaryPackage.registerTransform({
  type: `value`,
  transitive: true,
  name: `css/duplicate-rgb`,
  matcher: ({ value }) => value.includes('rgba(rgb('),
  transformer: ({ value }) => cleanRgbFromValue(value),
});

const twSpectrumConfig = {
  format: {
    // Transforming colors to a tailwind.config.js color Object
    tailwindThemeColorFormat,
  },

  source: ['tokens/spectrum.json'],
  platforms: {
    tailwind: {
      buildPath: 'output/',
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/cti/kebab'],
      files: [
        {
          filter: function (token) {
            return token.filePath === `tokens/spectrum.json`;
          },
          destination: 'colors.spectrum.tailwind.js',
          format: 'tailwindThemeColorFormat',
          options: {
            cssVariable: false,
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
      transforms: ['attribute/cti', 'name/cti/kebab', 'color/css'],
      files: [
        {
          filter: function (token) {
            return token.filePath === `tokens/light.json`;
          },
          destination: `colors.theme.tailwind.js`,
          format: 'tailwindThemeColorFormat',
          options: {
            cssVariable: true,
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
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'color/rgb',
          'css/duplicate-rgb',
        ],
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
