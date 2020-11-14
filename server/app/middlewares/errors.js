/**
 * @function errors
 * Error middleware
 * @param {Error} error
 *
 * @return {void}
 */
module.exports = async (error, { method, originalUrl, route: { path } }, res, next) => {
  console.error(`${method} ${originalUrl} ${error.status || ''} - ${error.type} - Error message -> ${error.message}`)

  res.status(error.status || 500).send(error)
}
