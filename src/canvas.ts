const axis = {
    gridColor: "rgb(200, 200, 200)",
    gridThickness: 1,
    gridTextFont: "12px Arial",
    mainAxisColor: "rgb(0, 0, 0)",
    mainAxisThickness: 3
};

const maxGrid = 10;
const minGrid = 5;
const gridFactor = 2;

export interface Parameters {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function toCanvasX(x: number, min: number, max: number): number {
    return (x - min) * (canvas.width / (max - min));
}

function toCanvasY(y: number, min: number, max: number): number {
    return canvas.height - (y - min) * (canvas.width / (max - min));
}

function getStepSize(min: number, max: number): number {
    let stepSize: number = 1;
    while (true) {
        let numSteps: number = (max - min) / stepSize;
        console.log("numSteps:", numSteps);
        if (numSteps < minGrid) {
            stepSize /= gridFactor;
            continue;
        } else if (numSteps > maxGrid) {
            stepSize *= gridFactor;
            continue;
        } else {
            break;
        }
    }

    return stepSize;
}

export function drawAxis(params: Parameters): void {
    ctx.reset();

    // Draw main axis
    ctx.beginPath();
    ctx.strokeStyle = axis.mainAxisColor;
    ctx.lineWidth = axis.mainAxisThickness;
    const originX = toCanvasX(0, params.xMin, params.xMax);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, canvas.height);
    const originY = toCanvasY(0, params.yMin, params.yMax);
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();

    // Draw background grid
    ctx.beginPath();
    ctx.strokeStyle = axis.gridColor;
    ctx.lineWidth = axis.gridThickness;
    ctx.font = axis.gridTextFont;

    const xStepSize = getStepSize(params.xMin, params.xMax);
    const xStart = Math.ceil(params.xMin / xStepSize) * xStepSize;
    const yStepSize = getStepSize(params.yMin, params.yMax);
    const yStart = Math.ceil(params.yMin / yStepSize) * yStepSize;
    console.log("params:", params);
    console.log("xStepSize:", xStepSize, "yStepSize", yStepSize);

    for (let x = xStart; x <= params.xMax; x += xStepSize) {
        const canvasX = toCanvasX(x, params.xMin, params.xMax);
        console.log("canvasX:", canvasX, "x:", x);
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, canvas.height);

        ctx.fillText(x.toPrecision(2), canvasX + 2, canvas.height - 6);
    }

    for (let y = yStart; y <= params.yMax; y += yStepSize) {
        const canvasY = toCanvasY(y, params.yMin, params.yMax);
        console.log("canvasY:", canvasY, "y:", y);
        ctx.moveTo(0, canvasY);
        ctx.lineTo(canvas.width, canvasY);

        ctx.fillText(y.toPrecision(2), 0, canvasY - 5);
    }

    ctx.stroke();
}