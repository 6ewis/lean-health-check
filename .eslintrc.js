module.exports = {
  extends: ['last'],
  env: {
    browser: true,
    amd: true,
    node: true,
    jest: true
  },
  rules: {
    'no-console': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called'
      }
    ],
    'comma-dangle': ['off']
  }
};
