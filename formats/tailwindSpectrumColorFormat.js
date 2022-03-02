/** @format */

const tailwindSpectrumColorFormat = function ({
  dictionary: { allTokens },
  options,
}) {
  const uniqueTypes = allTokens
    .map((item) => item.attributes.type)
    .filter((value, index, self) => self.indexOf(value) === index);

  let colors = 'module.exports = {';
  let hasItem = false;

  uniqueTypes.map((uniqueType) => {
    colors += `'${uniqueType}': {\n`;

    allTokens
      .filter(({ attributes: { type } }) => type === uniqueType)
      .map((token) => {
        let {
          attributes: { type, item },
          value,
        } = token;

        hasItem = !!item;

        if (item !== undefined) {
          colors += `${[item]}: '${value}',\n`;
        } else if (item === undefined) {
          colors = colors.slice(0, -3);
          colors += ` '${value}',\n`;
        }
      });
    if (hasItem) {
      colors += '},\n';
    }
  });
  //console.log(colors);
  colors += '}';

  return colors;
};

module.exports = tailwindSpectrumColorFormat;
