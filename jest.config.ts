import type { Config } from 'jest'
import { createDefaultEsmPreset } from 'ts-jest'

const presetConfig = createDefaultEsmPreset({
    tsconfig: './tsconfig.spec.json',
})

export default {
    ...presetConfig,
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
} satisfies Config