import { describe, expect, test } from '@jest/globals'
import { parse } from './parser'

describe('parse', () => {
    test.each([
        ['x^2', ['x', 2, '^']],
        ['3 * x + 2', [3, 'x', '*', 2, '+']],
        ['3*x^(2+3)', [3, 'x', 2, 3, '+', '^', '*']],
        ['-x', [-1, 'x', '*']],
        ['(-x)', [-1, 'x', '*']],
        ['3+4*2/(1-5)^2^3', [3, 4, 2, '*', 1, -1, 5, '*', '+', 2, 3, '^', '^', '/', '+']],
        ['-1.00*(x+0)+1', [-1, 1, '*', 'x', 0, '+', '*', 1, '+']]
    ])('parse("%s") => %j', (input: string, expected: (string | number)[]) => {
        expect(parse(input)).toEqual(expected);
    });

    test.each([
        ['1/x+1)1']
    ])('parse("%s")', (input: string) => {
        expect(() => parse(input)).toThrow("Incorrect equation");
    })
})

