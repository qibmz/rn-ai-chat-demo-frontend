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
      // gluestack 生成 UI：整目录移出 lint；禁止为过门禁去改该目录
      'components/ui/**',
      'types/ui-shim/**',
    ],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]);
