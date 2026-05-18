import { approximateFunction, derivative, evaluate, findRoots } from './approxiamator';
import { drawAxis, drawGraph } from './canvas';
import { Parameters } from './parameters';
import { parse } from './parser';

const updateButton = document.getElementById("update_button")! as HTMLButtonElement;
updateButton.onclick = updateOnClick;
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
const showRoots = document.getElementById("show_roots")! as HTMLInputElement;
showRoots.addEventListener('change', updateOnClick);
const rootList = document.getElementById("root_list")! as HTMLTableElement;

const tangentColor = "#FF9800";

function findInput(name: string): HTMLInputElement {
	const element = document.getElementById(name)! as HTMLInputElement;
	element.addEventListener('keyup', updateOnClick);

	return element;
}

function updateOnClick() {
	derivativeValue.textContent = "";
	errorMessage.textContent = "";
	evaluationY.textContent = "";
	try {
		for (let i = rootList.rows.length - 1; i >= 0; i--) {
			rootList.deleteRow(i);
		}

		const equation = parse(userEquation.value);
		console.log(equation);

		const params = new Parameters(
			parseFloat(xMin.value),
			parseFloat(xMax.value),
			parseFloat(yMin.value),
			parseFloat(yMax.value),
			parseInt(drawingSteps.value)
		);

		drawAxis(params);

		const approximatedFunction = approximateFunction(equation, params);
		drawGraph(params, approximatedFunction);

		if (derivativeX.value !== "") {
			let derivX = parseFloat(derivativeX.value);
			const derivY = evaluate(equation, derivX);
			const deriv = derivative(equation, derivX).toPrecision(3);
			derivX *= -1;
			const tangent = deriv + "*(x" + (derivX >= 0 ? "+" : "") + derivX + ")" + (derivY >= 0 ? "+" : "") + derivY;
			console.log("tangent:", tangent);
			drawGraph(params, approximateFunction(parse(tangent), params), tangentColor);

			derivativeValue.textContent = deriv;
		}

		if (evaluationX.value !== "") {
			let evaluatedValue = evaluate(equation, parseFloat(evaluationX.value)).toPrecision(3);
			if (evaluatedValue === "Infinity" || evaluatedValue === "-Infinity") evaluatedValue = "undefined";
			evaluationY.textContent = evaluatedValue;
		}

		if (showRoots.checked) {
			const roots = findRoots(equation, params);
			for (let root of roots) {
				const row = rootList.insertRow()
				row.insertCell().innerText = root.toFixed(5);
			}
		}
	} catch (error) {
		errorMessage.textContent = error as string;
	}
}

function main(): void {
	updateOnClick();
}

main();