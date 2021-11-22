const sortNew = (arr) => {
  return arr.sort((a, b) => {
    return b.value - a.value;
  });
};

module.exports = {
  sortNew,
};
