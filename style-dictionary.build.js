/** @format */
const StyleDictionaryPackage = require('style-dictionary');
const tailwindThemeColorFormat = require('./formats/tailwindColorFormat');
const reactThemeColorFormat = require('./formats/reactColorFormat');

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
      buildPath: 'src/output/',
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
      buildPath: 'src/output/',
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

const reactSpectrumConfig = {
  format: {
    reactThemeColorFormat,
  },
  source: ['tokens/spectrum.json'],
  platforms: {
    react: {
      buildPath: 'src/output/',
      transformGroup: 'js',
      transforms: ['name/cti/camel', 'size/object', 'color/css'],
      files: [
        {
          filter: function (token) {
            return token.filePath === `tokens/spectrum.json`;
          },
          destination: `colors.spectrum.react.js`,
          format: 'reactThemeColorFormat',
          options: {
            theme: true,
          },
        },
      ],
    },
  },
};

const reactThemeConfig = (theme) => ({
  format: {
    reactThemeColorFormat,
  },
  source: ['tokens/spectrum.json', `tokens/${theme}.json`],
  platforms: {
    react: {
      buildPath: 'src/output/',
      transformGroup: 'js',
      transforms: ['name/cti/camel', 'size/object', 'color/css'],
      files: [
        {
          filter: function (token) {
            return token.filePath === `tokens/${theme}.json`;
          },
          destination: `colors.theme.${theme}.react.js`,
          format: 'reactThemeColorFormat',
          options: {
            theme: true,
          },
        },
      ],
    },
  },
});

const themeConfig = (theme) => {
  return {
    source: ['tokens/spectrum.json', `tokens/${theme}.json`],
    platforms: {
      theme: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
        ],
        buildPath: `src/output/`,
        files: [
          {
            filter: function (token) {
              return token.filePath === `tokens/${theme}.json`;
            },
            destination: `theme-${theme}.css`,
            format: 'css/variables',
            selector: `.theme-${theme}`,
          },
        ],
      },
    },
  };
};

const colorsSpectrumCssVarsConfig = {
    source: ['tokens/spectrum.json'],
    platforms: {
      web: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
        ],
        buildPath: `src/output/`,
        files: [
          {
            destination: `colors-spectrum.css`,
            format: 'css/variables',
            selector: `:root`,
          },
        ],
      },
    },
  };

console.log('\n==============================================');
console.log(`\nProcessing: Spectrum`);
const dictionaryTailwindColors =
  StyleDictionaryPackage.extend(twSpectrumConfig);
dictionaryTailwindColors.buildPlatform('tailwind');

console.log(`\nProcessing: Theme`);
const dictionaryTailwindTheme = StyleDictionaryPackage.extend(twThemeConfig);
dictionaryTailwindTheme.buildPlatform('tailwind');

const dictionaryReactLightTheme = StyleDictionaryPackage.extend(reactThemeConfig('light'));
dictionaryReactLightTheme.buildPlatform('react');

const dictionaryReactDarkTheme = StyleDictionaryPackage.extend(reactThemeConfig('dark'));
dictionaryReactDarkTheme.buildPlatform('react');

const dictionaryReactSpectrum = StyleDictionaryPackage.extend(reactSpectrumConfig);
dictionaryReactSpectrum.buildPlatform('react');

console.log(`\nProcessing: Light`);
const dictionaryLight = StyleDictionaryPackage.extend(themeConfig('light'));
dictionaryLight.buildPlatform('theme');

console.log(`\nProcessing: Dark`);
const dictionaryDark = StyleDictionaryPackage.extend(themeConfig('dark'));
dictionaryDark.buildPlatform('theme');

const colorsSpectrumCss = StyleDictionaryPackage.extend(colorsSpectrumCssVarsConfig);
colorsSpectrumCss.buildPlatform('web');

console.log('\nEnd processing');
