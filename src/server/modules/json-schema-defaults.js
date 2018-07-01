import jsonSchemaDefaults from 'json-schema-defaults';

/**
 * Middleware to populate the request query or body with defaults
 * from a defined json schema
 * @param {Object} options Schema definitions for query or body
 * @returns {Function} Express middleware function
 */
export default (options = {}) => (req, res, next) => {
  if (options.query) req.query = { ...jsonSchemaDefaults(options.query), ...req.query };
  if (options.body) req.body = { ...jsonSchemaDefaults(options.body), ...req.body };
  next();
}
