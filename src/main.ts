import { approximateFunction } from './approxiamator';
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

function updateOnClick() {
	errorMessage.textContent = "";
	try {
		const equation = parse(userEquation.value);
		console.log(equation);

		const params = new Parameters(
			parseFloat(xMin.value),
			parseFloat(xMax.value),
			parseFloat(yMin.value),
			parseFloat(yMax.value),
		);

		drawAxis(params);
		const approximatedFunction = approximateFunction(equation, params, 1000);
		drawGraph(params, approximatedFunction);
	} catch (error) {
		errorMessage.textContent = error as string;
	}
}

function main(): void {
	updateOnClick();
}

main();