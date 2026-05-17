import { describe, expect, test } from '@jest/globals'
import { parse } from './parser'

describe('parse', () => {
    test.each([
        ['x^2', ['x', 2, '^']],
        ['3 * x + 2', [3, 'x', '*', 2, '+']],
        ['3*x^(2+3)', [3, 'x', 2, 3, '+', '^', '*']],
        ['3+4*2/(1-5)^2^3', [3, 4, 2, '*', 1, 5, '-', 2, 3, '^', '^', '/', '+']]
    ])('parse("%s") => %j', (input: string, expected: (string | number)[]) => {
        // console.log(parse(input));
        expect(parse(input)).toEqual(expected);
    })
})

