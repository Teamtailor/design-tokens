/** @format */

const tailwindThemeColorFormat = function ({
  dictionary: { allTokens },
  options,
}) {
  const uniqueTypes = allTokens
    .map((item) => item.attributes.type)
    .filter((value, index, self) => self.indexOf(value) === index);

  let colors = 'module.exports = {';
  let hasItem = false;

  const valueString = (path) => {
    return `var(--${path.join('-')})`;
  };

  uniqueTypes.map((uniqueType) => {
    colors += `'${uniqueType}': {\n`;

    allTokens
      .filter(({ attributes: { type } }) => type === uniqueType)
      .map((token) => {
        let { path } = token;

        colors += `'${[path.slice(2).join('-')]}': '${valueString(path)}',\n`;
      });

    colors += '},\n';
  });
  //console.log(colors);
  colors += '}';

  return colors;
};

module.exports = tailwindThemeColorFormat;
