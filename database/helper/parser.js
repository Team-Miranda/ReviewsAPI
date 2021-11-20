const urlParser = (arr) => {
  arr =
    "[" +
    arr.map((each) => {
      return `'${parseInt(each)}'`;
    }) +
    "]";
  return arr;
};

const valParser = (arr) => {
  arr =
    "[" +
    arr.map((each) => {
      return `'${parseInt(each)}'`;
    }) +
    "]";
  return arr;
};

module.exports = {
  urlParser,
  valParser,
};
