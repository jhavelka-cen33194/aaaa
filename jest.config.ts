import type {Config} from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  clearMocks: true
}

// noinspection JSUnusedGlobalSymbols
export default config
