const NodeCache = require("node-cache");

const cache = new NodeCache();

const cacheMeInside = (req, arr) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  consle.log(`this is request`, req);
  let resObj = {
    product: req.query.product_id,
    page: req.query.page || 0,
    count: result.rowCount || 5,
    result: [],
  };

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    resObj.result = cachedResponse;
    return resObj;
  } else {
    console.log(`Cache miss for ${key}`);
    resObj.result = arr;
    cache.set(key, arr, 120);
    return resObj;
  }
};

module.exports = {
  cacheMeInside,
};

// module.exports = cacheMe = (req) {
//   const key = req.originalUrl;
//   const cachedResponse = cache.get(key);

//   if (cachedResponse) {
//     console.log(`Cache hit for ${key}`);
//     res.send(cachedResponse)
//   } else {
//     console.log(`Cache miss for ${key}`);
//     res.originalSend = res.send;
//     res.send = body => {
//       res.originalSend(body);
//       cache.set(key, body, duration)
//     };
//     next();
//   }
// };
