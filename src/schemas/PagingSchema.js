export default {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      default: 1,
      minimum: 1,
      required: true,
    },
    limit: {
      type: 'integer',
      default: 2,
      minimum: 1,
      required: true,
    },
  },
}
