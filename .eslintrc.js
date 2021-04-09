module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: [
          'camelCase',
          'strictCamelCase',
          'PascalCase',
          'StrictPascalCase',
          'snake_case',
          'UPPER_CASE',
        ],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
    ],
  },
};