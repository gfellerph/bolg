export default path => ({
  service: 's3',
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-central-1',
  path,
})
