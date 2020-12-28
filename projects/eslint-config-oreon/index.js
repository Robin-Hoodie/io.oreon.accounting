const testFiles = [
  "**/tests/unit/**/*.spec.{j,t}s?(x)"
];

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: [
      "error",
      "double"
    ],
    "max-len": ["error", {
      code: 120,
      tabWidth: 2,
      ignoreUrls: true
    }],
    "lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true
      }
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "space-before-function-paren": [
      "error",
      "always"
    ]

  },
  overrides: [
    {
      files: testFiles,
      env: {
        jest: true
      }
    }
  ]
};

