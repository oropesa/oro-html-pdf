import {
  DEFAULT_IGNORES,
  setEslintLanguageOptionsProject,
  setEslintLanguageOptionsRootAsNode,
  setEslintPluginJest,
  setEslintPluginJestDom,
  setEslintPluginPrettier,
  setEslintPluginTypescriptEslint,
  setEslintPluginUnicorn,
} from './eslint.config.utils.js';

const allowList = ['dev', 'Dev', 'msg', 'args', 'Args', 'opts', 'utils'];

export default [
  { ignores: DEFAULT_IGNORES },
  setEslintLanguageOptionsProject(),
  setEslintLanguageOptionsRootAsNode(),
  setEslintPluginUnicorn({ allowList }),
  setEslintPluginJest(),
  setEslintPluginJestDom(),
  setEslintPluginPrettier(),
  ...setEslintPluginTypescriptEslint({
    rules: {
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }),
];
