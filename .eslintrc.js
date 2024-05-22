module.exports = {
	env: {
		es6: true,
		es2021: true,
		jest: true,
	},
	extends: ['standard-with-typescript', 'prettier'],
	parserOptions: {
		project: ['./tsconfig.json'],
		ecmaFeatures: {
			jsx: false,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		quotes: ['error', 'single', { avoidEscape: true }],
		'@typescript-eslint/no-throw-literal': 'off',
		'@typescript-eslint/strict-boolean-expressions': 'off',
	},
};
