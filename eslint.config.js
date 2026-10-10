const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  eslintConfigPrettier,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      'node_modules/*',
      // gluestack / starter UI kit — often conflicts with React Compiler lint + Reanimated patterns
      'components/ui/**',
    ],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]);
