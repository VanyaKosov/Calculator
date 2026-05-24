import type { Equation } from './parser';
import type { Parameters } from './parameters';
import { abs, acos, acot, asin, atan, cos, cot, fact, log, pow, sin, tan } from './math';

const tripleOperations = new Map<string, { (a: number, b: number, c: number): number }>([
    ["pow", (a: number, b: number, c: number): number => { return pow(c, b, a) }],
]);

const tupleOperations = new Map<string, { (a: number, b: number): number }>([
    ["-", (a: number, b: number): number => { return b - a }],
    ["+", (a: number, b: number): number => { return b + a }],
    ["*", (a: number, b: number): number => { return b * a }],
    ["/", (a: number, b: number): number => { return b / a }],
    ["^", (a: number, b: number): number => { return b ** a }],
    ["log", (a: number, b: number): number => { return log(b, a) }],
]);

const singleOperations = new Map<string, { (a: number): number }>([
    ["sin", (a: number): number => { return sin(a) }],
    ["cos", (a: number): number => { return cos(a) }],
    ["tan", (a: number): number => { return tan(a) }],
    ["cot", (a: number): number => { return cot(a) }],
    ["asin", (a: number): number => { return asin(a) }],
    ["acos", (a: number): number => { return acos(a) }],
    ["atan", (a: number): number => { return atan(a) }],
    ["acot", (a: number): number => { return acot(a) }],
    ["ln", (a: number): number => { return log(Math.E, a) }],
    ["fact", (a: number): number => { return fact(a) }],
    ["abs", (a: number): number => { return abs(a) }],
]);

const precision = 1 / (10 ** 8);
const newtonMethodMinDiff = 1 / (10 ** 12);
const newtonMethodMaxAttempts = 10000;

export class Pos {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export function evaluate(equation: Equation, x: number): number {
    let stack: Equation = [];
    const pop = (): number => {
        const val = stack.pop();
        if (val === undefined) throw "Incorrect equation";
        return val as number;
    }

    for (let val of equation) {
        if (typeof val === 'number') {
            stack.push(val);
            continue;
        }

        if (val === 'x') {
            stack.push(x);
            continue;
        }

        const tripleOperation = tripleOperations.get(val);
        if (tripleOperation) {
            stack.push(tripleOperation(pop(), pop(), pop()));
            continue;
        }

        const tupleOperation = tupleOperations.get(val);
        if (tupleOperation) {
            stack.push(tupleOperation(pop(), pop()));
            continue;
        }

        const singleOperation = singleOperations.get(val);
        if (!singleOperation) throw val + " operation not defined";
        stack.push(singleOperation(pop()));
    }

    if (stack.length > 1) throw "Incorrect equation";
    return pop();
}

export function approximateFunction(equation: Equation, params: Parameters): Pos[][] {
    let segments: Pos[][] = [];

    const stepSize = (params.xMax - params.xMin) / params.numSteps;
    let segment: Pos[] = [];
    let prevPos = new Pos(params.xMin, evaluate(equation, params.xMin));
    for (let x = params.xMin; x <= params.xMax + stepSize; x += stepSize) {
        const pos = new Pos(x, evaluate(equation, x));
        if (pos.y > params.yMax || pos.y < params.yMin) {
            if (prevPos.y <= params.yMax && prevPos.y >= params.yMin) {
                segment.push(pos);
            }

            if (segment.length > 0) {
                segments.push(segment);
                segment = [];
            }

            prevPos = pos;
            continue;
        }

        if (segment.length == 0) segment.push(prevPos);
        segment.push(pos);
        prevPos = pos;
    }

    segments.push(segment);

    return segments;
}

export function derivative(equation: Equation, x: number): number {
    const x1 = x - precision;
    const x2 = x + precision;
    const y1 = evaluate(equation, x1);
    const y2 = evaluate(equation, x2);
    return (y2 - y1) / (x2 - x1)
}

// Newton's method
function estimateRoot(equation: Equation, guess: number): number {
    const getNextGuess = (): number => {
        return guess - evaluate(equation, guess) / derivative(equation, guess);
    };

    let numAttempts = 0;
    let nextGuess = getNextGuess();
    while (Math.abs(nextGuess - guess) > newtonMethodMinDiff) {
        guess = nextGuess;
        nextGuess = getNextGuess();

        numAttempts++;
        if (numAttempts >= newtonMethodMaxAttempts) return NaN;
    }

    return nextGuess;
}

export function findRoots(equation: Equation, params: Parameters): number[] {
    const stepSize = (params.xMax - params.xMin) / params.numSteps;

    let roots: number[] = [];
    const push = (n: number) => {
        if (!roots.find((num) => {
            return Math.abs(num - n) < precision;
        })) {
            roots.push(n);
        }
    };

    let prevY = evaluate(equation, params.xMin);
    let prevDeriv = derivative(equation, params.xMin);
    for (let x = params.xMin + stepSize; x <= params.xMax; x += stepSize) {
        const y = evaluate(equation, x);
        const deriv = derivative(equation, x);
        if ((prevY > 0 && y < 0) ||
            (prevY < 0 && y > 0) ||
            (prevDeriv > 0 && deriv < 0) ||
            (prevDeriv < 0 && deriv > 0)) {

            let estimate = estimateRoot(equation, x);
            if (!isNaN(estimate) && estimate >= params.xMin && estimate <= params.xMax) {
                push(estimate);
            }
        }

        if (deriv == 0 && Math.abs(y) < newtonMethodMinDiff) {
            push(x);
        }

        prevY = y;
        prevDeriv = deriv;
    }

    return roots;
}

export function integral(equation: Equation, numSteps: number, from: number, to: number): number {
    const stepSize = (to - from) / numSteps;

    let sum = 0;
    let prev = evaluate(equation, from);
    for (let x = from + stepSize; x <= to; x += stepSize) {
        const val = evaluate(equation, x);
        sum += (prev + val) / 2 * stepSize;

        if (sum === Infinity) return Infinity;
        if (sum === -Infinity) return -Infinity;

        prev = val;
    }

    return sum;
}