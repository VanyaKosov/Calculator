import { describe, expect, test } from '@jest/globals'
import { cos, cot, sin, tan } from './math';

describe('sin', () => {
    test.each([
        [0, 0],
        [Math.PI / 2, 1],
        [Math.PI, 0],
        [3 * Math.PI / 2, -1],
        [2 * Math.PI, 0],
        [10, -0.5440211109],
        [100, -0.5063656411],
        [-100, 0.5063656411]
    ])('sin(%d) => %d', (input: number, expected: number) => {
        expect(sin(input)).toBeCloseTo(expected, 10);
    })
});

describe('cos', () => {
    test.each([
        [0, 1],
        [Math.PI / 2, 0],
        [Math.PI, -1],
        [3 * Math.PI / 2, 0],
        [2 * Math.PI, 1],
        [10, -0.8390715291],
        [100, 0.8623188723],
        [-100, 0.8623188723]
    ])('cos(%d) => %d', (input: number, expected: number) => {
        expect(cos(input)).toBeCloseTo(expected, 10);
    })
})

describe('tan', () => {
    test.each([
        [0, 0],
        [Math.PI / 2, Infinity],
        [Math.PI, 0],
        [3 * Math.PI / 2, -Infinity],
        [2 * Math.PI, 0],
        [10, 0.6483608275],
        [100, -0.5872139152],
        [-100, 0.5872139152]
    ])('tan(%d) => %d', (input: number, expected: number) => {
        expect(tan(input)).toBeCloseTo(expected, 10);
    })
})

describe('cot', () => {
    test.each([
        [0, Infinity],
        [Math.PI / 2, 0],
        [Math.PI, -Infinity],
        [3 * Math.PI / 2, -0],
        [2 * Math.PI, Infinity],
        [10, 1.5423510454],
        [100, -1.7029569194],
        [-100, 1.7029569194]
    ])('cot(%d) => %d', (input: number, expected: number) => {
        expect(cot(input)).toBeCloseTo(expected, 10);
    })
})