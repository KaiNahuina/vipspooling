import type { Config } from 'jest';
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  preset: 'ts-jest',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^.+/(amplify/backend/function/.*)$': '<rootDir>/amplify/#current-cloud-backend/function/$1', // Prefer cloud backend
  },
  // OR restrict roots to avoid scanning amplify/backend duplicates
  roots: ['<rootDir>/app', '<rootDir>/src'],
};

export default createJestConfig(config);