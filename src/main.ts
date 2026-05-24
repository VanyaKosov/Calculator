import { approximateFunction, derivative, evaluate, findRoots, integral, Pos } from './approxiamator';
import { drawAxis, drawGraph, shadeArea, toGraphX, toGraphY } from './canvas';
import { Parameters } from './parameters';
import { parse } from './parser';

const updateButton = document.getElementById("update_button")! as HTMLButtonElement;
updateButton.onclick = update;
const errorMessage = document.getElementById("error_message")! as HTMLLabelElement;
const xMin = findInput("x_min");
const xMax = findInput("x_max");
const yMin = findInput("y_min");
const yMax = findInput("y_max");
const userEquation = findInput("equation");
const drawingSteps = findInput("drawing_steps");
const derivativeX = findInput("derivative_x");
const derivativeValue = document.getElementById("derivative_value")! as HTMLInputElement;
const evaluationX = findInput("evaluation_x");
const evaluationY = document.getElementById("evaluation_y")! as HTMLInputElement;
const integralFrom = findInput("integral_from");
const integralTo = findInput("integral_to");
const integralValue = document.getElementById("integral_value")! as HTMLInputElement;
const showRoots = document.getElementById("show_roots")! as HTMLInputElement;
showRoots.addEventListener('change', scheduleUpdate);
const rootList = document.getElementById("root_list")! as HTMLTableElement;
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.addEventListener("wheel", scroll);
canvas.addEventListener("mousedown", dragStart);
canvas.addEventListener("mousemove", drag);
canvas.addEventListener("mouseup", dragStop);
canvas.addEventListener("mouseout", dragStop);

const tangentColor = "#FF9800";
let updateTimeout: number | undefined = undefined;
const scrollMultiplier = 1.1;
let prevGraphMousePos: Pos | undefined = undefined;

function findInput(name: string): HTMLInputElement {
	const element = document.getElementById(name)! as HTMLInputElement;
	element.addEventListener('keyup', scheduleUpdate);
	element.addEventListener('change', scheduleUpdate);

	return element;
}

function scheduleUpdate() {
	if (updateTimeout) return;

	updateTimeout = setTimeout(() => {
		updateTimeout = undefined;
		update();
	}, 10);
}

function readParams(): Parameters {
	return new Parameters(
		parseFloat(xMin.value),
		parseFloat(xMax.value),
		parseFloat(yMin.value),
		parseFloat(yMax.value),
		parseInt(drawingSteps.value)
	);
}

function update() {
	derivativeValue.textContent = "";
	errorMessage.textContent = "";
	evaluationY.textContent = "";
	integralValue.textContent = "";

	try {
		for (let i = rootList.rows.length - 1; i >= 0; i--) {
			rootList.deleteRow(i);
		}

		const equation = parse(userEquation.value);
		console.log(equation);

		const params = readParams();

		drawAxis(params);

		const approximatedFunction = approximateFunction(equation, params);
		drawGraph(params, approximatedFunction);

		if (derivativeX.value !== "") {
			let derivX = parseFloat(derivativeX.value);
			const derivY = evaluate(equation, derivX);
			let deriv = derivative(equation, derivX);
			derivX *= -1;
			const tangent = deriv + "*(x" + (derivX >= 0 ? "+" : "") + derivX + ")" + (derivY >= 0 ? "+" : "") + derivY;
			console.log("tangent:", tangent);
			drawGraph(params, approximateFunction(parse(tangent), params), tangentColor);

			derivativeValue.textContent = deriv.toPrecision(5);
		}

		if (evaluationX.value !== "") {
			let evaluatedValue = evaluate(equation, parseFloat(evaluationX.value)).toPrecision(5);
			if (evaluatedValue === "Infinity" || evaluatedValue === "-Infinity") evaluatedValue = "undefined";
			evaluationY.textContent = evaluatedValue;
		}

		let integralFromVal = parseFloat(integralFrom.value);
		let integralToVal = parseFloat(integralTo.value);
		if (integralFrom.value !== "" || integralTo.value !== "") {
			if (isNaN(integralFromVal)) {
				throw '"Integral from" is not valid';
			}

			if (isNaN(integralToVal)) {
				throw '"Integral to" is not valid';
			}

			if (integralFromVal >= integralToVal) {
				throw '"Integral from" must be smaller than "Integral to"';
			}

			integralValue.textContent = integral(equation, params.numSteps, integralFromVal, integralToVal).toPrecision(5);
			const functionApproximationForIntegral = approximateFunction(equation, new Parameters(
				Math.max(integralFromVal, params.xMin), Math.min(integralToVal, params.xMax), -Infinity, Infinity, canvas.width
			));
			shadeArea(params, functionApproximationForIntegral[0], integralFromVal, integralToVal);
		}

		if (showRoots.checked) {
			const roots = findRoots(equation, params);
			for (let root of roots) {
				const row = rootList.insertRow()
				if (Math.abs(root) < 1 / (10 ** 8)) root = 0;
				row.insertCell().innerText = root.toPrecision(5);
			}
		}
	} catch (error) {
		errorMessage.textContent = error as string;
	}
}

function scroll(event: WheelEvent) {
	let mul = 1;
	if (event.deltaY > 0) { // zoom out
		mul *= scrollMultiplier;
	} else if (event.deltaY < 0) { // zoom in
		mul /= scrollMultiplier;
	} else {
		return;
	}

	let params = readParams();
	let canvasPos = new Pos(event.x - canvas.getBoundingClientRect().left, event.y - canvas.getBoundingClientRect().top);
	const oldPos = new Pos(toGraphX(canvasPos.x, params.xMin, params.xMax), toGraphY(canvasPos.y, params.yMin, params.yMax));

	const newXMin = params.xMin * mul;
	const newXMax = params.xMax * mul;
	const newYMin = params.yMin * mul;
	const newYMax = params.yMax * mul;

	const newPos = new Pos(toGraphX(canvasPos.x, newXMin, newXMax), toGraphY(canvasPos.y, newYMin, newYMax));
	const offset = new Pos(oldPos.x - newPos.x, oldPos.y - newPos.y);

	xMin.value = (newXMin + offset.x).toString();
	xMax.value = (newXMax + offset.x).toString();
	yMin.value = (newYMin + offset.y).toString();
	yMax.value = (newYMax + offset.y).toString();

	scheduleUpdate();
}

function dragStart(event: MouseEvent) {
	const params = readParams();
	prevGraphMousePos = new Pos(toGraphX(event.x, params.xMin, params.xMax), toGraphY(event.y, params.yMin, params.yMax));
}

function drag(event: MouseEvent) {
	if (prevGraphMousePos === undefined) return;

	const params = readParams();
	const currentGraphMousePos = new Pos(toGraphX(event.x, params.xMin, params.xMax), toGraphY(event.y, params.yMin, params.yMax));
	const offset = new Pos(prevGraphMousePos.x - currentGraphMousePos.x, prevGraphMousePos.y - currentGraphMousePos.y);

	xMin.value = (params.xMin + offset.x).toString();
	xMax.value = (params.xMax + offset.x).toString();
	yMin.value = (params.yMin + offset.y).toString();
	yMax.value = (params.yMax + offset.y).toString();

	scheduleUpdate();
}

function dragStop() {
	prevGraphMousePos = undefined;
}

function main(): void {
	update();
}

main();