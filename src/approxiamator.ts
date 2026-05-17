import type { Equation } from './parser';
import type { Parameters } from './parameters';

const tupleOperations = new Map<string, { (a: number, b: number): number }>([
    ["-", (a: number, b: number): number => { return b - a }],
    ["+", (a: number, b: number): number => { return b + a }],
    ["*", (a: number, b: number): number => { return b * a }],
    ["/", (a: number, b: number): number => { return b / a }],
    ["^", (a: number, b: number): number => { return b ** a }],
]);

const singleOperations = new Map<string, { (a: number): number }>([
]);

export class Pos {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function evaluate(equation: Equation, x: number): number {
    let stack: Equation = [];

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

            stack.push(tupleOperation(stack.pop() as number, stack.pop() as number));
            continue;
        }

        const singleOperation = singleOperations.get(val);
        if (!singleOperation) throw val + " operation not defined";
        stack.push(singleOperation(stack.pop() as number));
    }

    return stack.pop() as number;
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