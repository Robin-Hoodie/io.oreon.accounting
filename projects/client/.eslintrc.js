const testFiles = [
  "**/__tests__/*.{j,t}s?(x)",
  "**/tests/unit/**/*.spec.{j,t}s?(x)"
];

const vueConfigFile = "vue.config.js";

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    semi: [
      "warn",
      "always"
    ],
    quotes: [
      "warn",
      "double"
    ],
    "lines-between-class-members": [
      "warn",
      "always",
      {
        exceptAfterSingleLine: true
      }
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [...testFiles, vueConfigFile],
        optionalDependencies: false,
        peerDependencies: false,
        bundledDependencies: false
      }
    ],
    // It's allowed to have more than one element in the template root in Vue 3
    "vue/no-multiple-template-root": "off"
  },
  overrides: [
    {
      files: testFiles,
      env: {
        jest: true
      }
    },
    {
      files: [vueConfigFile],
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
};
