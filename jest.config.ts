/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['./src/**'],
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
	coverageThreshold: {
		global: {
			branches: 10,
			functions: 50,
			lines: 50,
			statements: 50,
		},
	},
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	setupFiles: ['<rootDir>/jest.setup.ts'],
	transform: {
		'.*\\.spec\\.ts': ['ts-jest', { isolatedModules: true }],
	},
	moduleNameMapper: {
		'^@ServiceConstants': '<rootDir>/src/ServiceConstants',
		'^@api/(.*)$': '<rootDir>/src/api/$1',
		'^@libs/(.*)$': '<rootDir>/src/api/libs/$1',
		'^@models/(.*)$': '<rootDir>/src/api/models/$1',
		'^@repositories/(.*)$': '<rootDir>/src/api/repositories/$1',
		'^@services/(.*)$': '<rootDir>/src/api/services/$1',
		'^@utils/(.*)$': '<rootDir>/src/api/utils/$1',
		'^@aws-clients/(.*)$': '<rootDir>/src/api/aws-sdk/$1',
	},
};
