module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 80],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'start-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'Add', // new features
        'Update', // updates in existing functionality
        'Deprecate', // soon-to-be remove features
        'Remove', // remove features
        'Fix', // any bug fixes
        'Security', // in case of vulnerabilities
      ],
    ],
  },
}
