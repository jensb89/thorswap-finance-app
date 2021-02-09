// Severity codes: 0 = off, 1 = warn, 2 = error
module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },

  root: true,

  plugins: ['@typescript-eslint'],

  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],

  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mdx'],
      },
    },
  },

  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/quotes': [2, 'single'],
    '@typescript-eslint/no-shadow': 1,
    '@typescript-eslint/naming-convention': 1,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-types': 0,

    'react/display-name': 0,
    'react/prop-types': 0,
    'react/no-children-prop': 0,
    'react/no-unescaped-entities': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-wrap-multilines': 1,
    'react/no-array-index-key': 1,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-indent': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-wrap-multilines': 0,
    'react/no-array-index-key': 0,

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,

    'import/prefer-default-export': 0,
    'array-callback-return': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 1,
    'no-restricted-globals': 0,
    'guard-for-in': 1,
    'no-empty': 0,
    'no-undef': 0,
    'no-nested-ternary': 0,
    'no-plusplus': 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'import/no-extraneous-dependencies': 0,
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external', 'internal'],
          ['parent', 'sibling', 'index'],
        ],
        pathGroups: [
          {
            group: 'builtin',
            pattern: 'react-**',
            position: 'before',
          },
          {
            group: 'builtin',
            pattern: 'react',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
}
