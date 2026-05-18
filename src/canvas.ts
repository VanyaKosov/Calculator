import type { Pos } from './approxiamator';
import type { Parameters } from './parameters';

const style = {
    grid: {
        color: "rgb(200, 200, 200)",
        thickness: 1,
        font: "12px Arial"
    },
    axis: {
        color: "rgb(0, 0, 0)",
        thickness: 3
    },
    graph: {
        color: "rgb(56, 30, 219)",
        thickness: 2
    }
};

const maxGrid = 10;
const minGrid = 5;
const gridFactor = 2;

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function toCanvasX(x: number, min: number, max: number): number {
    return (x - min) * (canvas.width / (max - min));
}

function toCanvasY(y: number, min: number, max: number): number {
    return canvas.height - (y - min) * (canvas.height / (max - min));
}

/*function toGraphX(x: number, min: number, max: number): number {
    return (x + min) * ((max - min) / canvas.width);
}

function toGraphY(y: number, min: number, max: number): number {
    return canvas.height - (y + min) * ((max - min) / canvas.height);
}*/

function getStepSize(min: number, max: number): number {
    let stepSize: number = 1;
    while (true) {
        let numSteps: number = (max - min) / stepSize;
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
    ctx.strokeStyle = style.axis.color;
    ctx.lineWidth = style.axis.thickness;
    const originX = toCanvasX(0, params.xMin, params.xMax);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, canvas.height);
    const originY = toCanvasY(0, params.yMin, params.yMax);
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();

    // Draw background grid
    ctx.beginPath();
    ctx.strokeStyle = style.grid.color;
    ctx.lineWidth = style.grid.thickness;
    ctx.font = style.grid.font;

    const xStepSize = getStepSize(params.xMin, params.xMax);
    const xStart = Math.ceil(params.xMin / xStepSize) * xStepSize;
    const yStepSize = getStepSize(params.yMin, params.yMax);
    const yStart = Math.ceil(params.yMin / yStepSize) * yStepSize;

    for (let x = xStart; x <= params.xMax; x += xStepSize) {
        const canvasX = toCanvasX(x, params.xMin, params.xMax);
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, canvas.height);

        ctx.fillText(x.toPrecision(2), canvasX + 2, canvas.height - 6);
    }

    for (let y = yStart; y <= params.yMax; y += yStepSize) {
        const canvasY = toCanvasY(y, params.yMin, params.yMax);
        ctx.moveTo(0, canvasY);
        ctx.lineTo(canvas.width, canvasY);

        ctx.fillText(y.toPrecision(2), 0, canvasY - 5);
    }

    ctx.stroke();
}

export function drawGraph(params: Parameters, segments: Pos[][], color = style.graph.color): void {
    for (let segment of segments) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = style.graph.thickness;

        for (let i = 0; i < segment.length - 1; i++) {
            ctx.moveTo(toCanvasX(segment[i].x, params.xMin, params.xMax), toCanvasY(segment[i].y, params.yMin, params.yMax));
            ctx.lineTo(toCanvasX(segment[i + 1].x, params.xMin, params.xMax), toCanvasY(segment[i + 1].y, params.yMin, params.yMax));
        }

        ctx.stroke();
    }
}
