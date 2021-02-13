//*Вариант с асинк обверткой*//
// module.exports.asyncWrapper = (callback) => {
//   return function (req, res, next) {
//     callback(req, res, next).catch(next);
//   };
// };
