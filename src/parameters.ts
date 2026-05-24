const minViewWindow = 10 ** (-8);

export class Parameters {

    public readonly xMin: number;
    public readonly xMax: number;
    public readonly yMin: number;
    public readonly yMax: number;
    public readonly numSteps: number;

    public constructor(xMin: number, xMax: number, yMin: number, yMax: number, numSteps: number) {
        if (isNaN(xMin)) throw '"X min" must be defined';
        if (isNaN(xMax)) throw '"X max" must be defined';
        if (isNaN(yMin)) throw '"Y min" must be defined';
        if (isNaN(yMax)) throw '"Y max" must be defined';
        if (isNaN(numSteps)) throw '"Drawing steps" must be defined';
        if (xMin >= xMax) throw '"X min" must be less than "X max"';
        if (yMin >= yMax) throw '"Y min" must be less than "Y max"';

        if ((xMax - xMin) < minViewWindow) xMax = xMin + minViewWindow;
        this.xMin = xMin;
        this.xMax = xMax;
        if ((yMax - yMin) < minViewWindow) yMax = yMin + minViewWindow;
        this.yMin = yMin;
        this.yMax = yMax;
        this.numSteps = numSteps;
    }
}