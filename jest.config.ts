import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      useESM: true,
    }],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testMatch: ['<rootDir>app/source/testing/**/*.ts'], // Solo ejecuta archivos de prueba en source/testing
};

export default config;