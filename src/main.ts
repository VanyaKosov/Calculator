import { approximateFunction, derivative, evaluate, findRoots } from './approxiamator';
import { drawAxis, drawGraph } from './canvas';
import { Parameters } from './parameters';
import { parse } from './parser';

const updateButton = document.getElementById("update_button")! as HTMLButtonElement;
updateButton.onclick = updateOnClick;
const errorMessage = document.getElementById("error_message")! as HTMLLabelElement;
const xMin = document.getElementById("x_min")! as HTMLInputElement;
const xMax = document.getElementById("x_max")! as HTMLInputElement;
const yMin = document.getElementById("y_min")! as HTMLInputElement;
const yMax = document.getElementById("y_max")! as HTMLInputElement;
const userEquation = document.getElementById("equation")! as HTMLInputElement;
const drawingSteps = document.getElementById("drawing_steps")! as HTMLInputElement;
const derivativeX = document.getElementById("derivative_x")! as HTMLInputElement;
const derivativeValue = document.getElementById("derivative_value")! as HTMLInputElement;
const evaluationX = document.getElementById("evaluation_x")! as HTMLInputElement;
const evaluationY = document.getElementById("evaluation_y")! as HTMLInputElement;
const showRoots = document.getElementById("show_roots")! as HTMLInputElement;
const rootList = document.getElementById("root_list")! as HTMLTableElement;

const tangentColor = "rgb(200, 100, 23)";

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
			const tangent = deriv + "*(x" + (derivX > 0 ? "+" : "") + derivX + ")" + (derivY > 0 ? "+" : "") + derivY;
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