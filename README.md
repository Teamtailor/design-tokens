# Teamtailor Design tokens

Repository for converting Figma design tokens into readable format for Tailwind to be used in all Teamtailor apps.

## Install

```
yarn add -D @teamtailor/design-tokens
```

## Usage

To use this inside your Tailwind config you should import the relevant config into `tailwind.config.js` inside your project and override the theme conf for that setting.

#### Example

```javascript
// tailwind.config.js
const tokenColors = require('@teamtailor/design-tokens/output/colors.spectrum.tailwind.js');
const themeColors = require('@teamtailor/design-tokens/output/colors.theme.tailwind.js');

module.exports = {
  // ...
  theme: {
    colors: {
      ...tokenColors,
    },
    extend: {
      backgroundColor: {
        ...themeColors.background,
      },
      textColor: {
        ...themeColors.text,
        icon: {
          ...themeColors.icon,
        },
      },
      borderColor: {
        ...themeColors.border,
      },
    },
  },
};
```

### Themes

Make sure to import the specific theme css files to be able to use functional color names.

Css files are located here and are apply by using `.theme-light` or `.theme-dark`, on a wrapper.

```
@teamtailor/design-tokens/output/theme-light.css';
@teamtailor/design-tokens/output/theme-dark.css';
```

## Configs

These are the possible config files that you can use inside your tailwind.config.js

| Config          | File path                          |
| --------------- | ---------------------------------- |
| spectrum colors | output/colors.spectrum.tailwind.js |
| theme colors    | output/colors.theme.tailwind.js    |
