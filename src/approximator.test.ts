import { describe, expect, test } from '@jest/globals'
import type { Equation } from './parser';
import { Parameters } from './parameters';
import { approximateFunction, Pos } from './approxiamator'

describe('parse', () => {
    test.each([
        [['x', 2, '^'], new Parameters(-5, 5, -5, 5), 10, [[new Pos(-3, 9), new Pos(-2, 4), new Pos(-1, 1), new Pos(0, 0), new Pos(1, 1), new Pos(2, 4), new Pos(3, 9)], []]],

    ])('approximateFunction("%s", %s, %s) => %j', (equation: Equation, params: Parameters, numSteps: number, expected: Pos[][]) => {
        expect(approximateFunction(equation, params, numSteps)).toEqual(expected);
    })
})