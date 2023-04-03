/** @format */

const _ = require('lodash');
const { fileHeader } = require('style-dictionary/lib/common/formatHelpers');
const Color = require('tinycolor2')

const hexRegex = /#[0-9A-Fa-f]{6}\b/;
const rgx = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;

const reactColorFormat= function ({
  dictionary: { allTokens },
  options: { theme },
  file,
}) {
  const colors = {};
  
  const toReactColor = (value) => {
    while (value.match(/rgba\(\#/)) {
      let c = Color(value.match(hexRegex)[0]).toRgbString();
      value = value.replace(hexRegex, c).replace(rgx, '$1,$2,$3');
    }
    return value;
  };
  
  allTokens.forEach((token) => {
    const { path, value } = token;

    _.setWith(
      colors,
      path.slice(1).map(a => _.camelCase(a)).join('.'),
      toReactColor(value),
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
