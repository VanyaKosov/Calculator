import { approximateFunction } from './approxiamator';
import { drawAxis, drawGraph } from './canvas';
import type { Parameters } from './parameters';
import { parse } from './parser';

const updateButton = document.getElementById("update_button")! as HTMLButtonElement;
updateButton.onclick = updateOnClick;
const xMin = document.getElementById("x_min")! as HTMLInputElement;
const xMax = document.getElementById("x_max")! as HTMLInputElement;
const yMin = document.getElementById("y_min")! as HTMLInputElement;
const yMax = document.getElementById("y_max")! as HTMLInputElement;
const userEquation = document.getElementById("equation")! as HTMLInputElement;

function updateOnClick() {
	const equation = parse(userEquation.value);
	console.log(equation);

	const params: Parameters = {
		xMin: parseFloat(xMin.value),
		xMax: parseFloat(xMax.value),
		yMin: parseFloat(yMin.value),
		yMax: parseFloat(yMax.value),
	}

	drawAxis(params);
	drawGraph(params, approximateFunction(equation, params, 500));
}

function main(): void {
	updateOnClick();
}

main();