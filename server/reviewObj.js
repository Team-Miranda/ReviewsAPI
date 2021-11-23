const reviewObj = (page, count, product_id, results) => {
  this.product_id = product_id;
  this.page = page || 0;
  this.count = count || 5;
  this.result = results;
};

module.exports = {
  reviewObj,
};
