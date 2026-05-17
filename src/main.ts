import { drawAxis } from './canvas';
import type { Parameters } from './canvas';
import { parse } from './parser';

const updateButton = document.getElementById("update_button")! as HTMLButtonElement;
updateButton.onclick = updateOnClick;
const xMin = document.getElementById("x_min")! as HTMLInputElement;
const xMax = document.getElementById("x_max")! as HTMLInputElement;
const yMin = document.getElementById("y_min")! as HTMLInputElement;
const yMax = document.getElementById("y_max")! as HTMLInputElement;
const equation = document.getElementById("equation")! as HTMLInputElement;

function updateOnClick() {
	const parsedEquation = parse(equation.value);
	console.log(parsedEquation);
	// TODO: draw graph

	const params: Parameters = {
		xMin: parseFloat(xMin.value),
		xMax: parseFloat(xMax.value),
		yMin: parseFloat(yMin.value),
		yMax: parseFloat(yMax.value),
	}
	drawAxis(params);
}

function main(): void {
	updateOnClick();
}

main();