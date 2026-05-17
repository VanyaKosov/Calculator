import type { Equation } from './parser';
import type { Parameters } from './parameters';
import { abs, acos, acot, asin, atan, cos, cot, fact, log, sin, tan } from './math';

const tupleOperations = new Map<string, { (a: number, b: number): number }>([
    ["-", (a: number, b: number): number => { return b - a }],
    ["+", (a: number, b: number): number => { return b + a }],
    ["*", (a: number, b: number): number => { return b * a }],
    ["/", (a: number, b: number): number => { return b / a }],
    ["^", (a: number, b: number): number => { return b ** a }],
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
    ["log", (a: number): number => { return log(10, a) }],
    ["ln", (a: number): number => { return log(Math.E, a) }],
    ["fact", (a: number): number => { return fact(a) }],
    ["abs", (a: number): number => { return abs(a) }],
]);

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

export function approximateFunction(equation: Equation, params: Parameters, numSteps: number): Pos[][] {
    let segments: Pos[][] = [];

    const stepSize = (params.xMax - params.xMin) / numSteps;
    let segment: Pos[] = [];
    let prevPos = new Pos(params.xMin, evaluate(equation, params.xMin));
    for (let x = params.xMin; x <= params.xMax; x += stepSize) {
        const pos = new Pos(x, evaluate(equation, x));
        if (pos.y > params.yMax || pos.y < params.yMin) {
            if (prevPos.y <= params.yMax && prevPos.y >= params.yMin) segment.push(pos);

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