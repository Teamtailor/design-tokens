/** @format */

// The block is `inline` so utilities keep var(--color-…) rather than a theme
// variable resolved once at :root; that is what lets .theme-dark on a wrapper
// switch the functional colours.
//
// Tailwind v4 namespace for each functional colour group. A group listed with
// a prefix keeps it in the class name: icon tokens become text-icon-*.
const NAMESPACES = {
  'background-color': [['background']],
  'border-color': [['border']],
  'outline-color': [['outline'], ['border']],
  'text-color': [['text'], ['icon', 'icon']],
  'box-shadow-color': [['background']],
};

const utilityName = (path, prefix) => {
  const parts = [prefix, ...path.slice(2)].filter(Boolean);
  return parts[parts.length - 1] === 'DEFAULT' ? parts.slice(0, -1) : parts;
};

const tailwindThemeCssFormat = function ({ dictionary: { allTokens } }) {
  const spectrum = allTokens.filter(
    (token) => token.filePath === 'tokens/spectrum.json'
  );
  const functional = allTokens.filter(
    (token) => token.filePath !== 'tokens/spectrum.json'
  );

  const spectrumLines = spectrum.map(
    (token) => `  --${token.name}: ${token.value};`
  );

  const namespaceBlocks = Object.entries(NAMESPACES).map(
    ([namespace, groups]) =>
      groups
        .flatMap(([group, prefix]) =>
          functional
            .filter((token) => token.path[1] === group)
            .map(
              (token) =>
                `  --${namespace}-${utilityName(token.path, prefix).join('-')}: var(--${token.name});`
            )
        )
        .join('\n')
  );

  return `@theme inline {\n${[spectrumLines.join('\n'), ...namespaceBlocks].join('\n\n')}\n}\n`;
};

module.exports = tailwindThemeCssFormat;
