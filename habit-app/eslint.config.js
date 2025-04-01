import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginPrettier from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.{js,mjs,jsx,vue}'],
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      vue: pluginVue,
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
]
