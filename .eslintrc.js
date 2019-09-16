module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: "airbnb-base",

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    "linebreak-style": ["off"],
    "semi": ["error", "never"],
    "no-shadow": ["off"],
    "comma-dangle": [2, "never"],
    "no-console": ["off"],
    "no-debugger": ["off"],
    "no-unused-vars": ["off"],
    "arrow-parens": ["error", "as-needed"]
  }
}
