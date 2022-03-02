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
const tokenColors = require('@teamtailor/design-tokens/output/color.spectrum.tailwind.js');
const themeColors = require('@teamtailor/design-tokens/output/color.theme.tailwind.js');


module.exports = {
  // ...
  theme: {
    colors: {
      ...tokenColors,
    },
    backgroundColors: {
      ...themeColors.background,
    },
    textColors: {
      ...themeColors.text,
    },
    borderColors: {
      ...themeColors.border,
    }
  },
};
```

## Configs

These are the possible config files that you can use inside your tailwind.config.js

| Config | File path                       |
| ------ | ------------------------------- |
| colors | output/color.tokens.tailwind.js |
