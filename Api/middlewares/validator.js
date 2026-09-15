const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajvErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);
ajvErrors(ajv);

const schemas = {
  createTransaction: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['expense', 'income'] },
      amount: { type: 'number', minimum: 0.01 },
      category: { type: 'string' },
      description: { type: 'string' },
      date: { type: 'string' }
    },
    required: ['type', 'amount', 'category']
  },
  updateTransaction: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['expense', 'income'] },
      amount: { type: 'number', minimum: 0.01 },
      category: { type: 'string' },
      description: { type: 'string' },
      date: { type: 'string' }
    }
  }
};

Object.keys(schemas).forEach(name => {
  ajv.addSchema(schemas[name], name);
});

module.exports = {
  validator: schemaName => (req, res, next) => {
    const validate = ajv.getSchema(schemaName);
    if (!validate) return next();
    const valid = validate(req.body);
    if (!valid) {
      return res.status(400).json({ message: 'Validation error', errors: validate.errors });
    }
    return next();
  }
};
