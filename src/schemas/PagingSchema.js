export default {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      default: 1,
      minimum: 1,
    },
    limit: {
      type: 'integer',
      default: 2,
      minimum: 1,
    },
  },
  dependencies: {
    page: { required: ['limit'] },
    limit: { required: ['page'] },
  },
}
