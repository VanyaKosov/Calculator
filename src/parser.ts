export type Equation = (number | string)[];

const operatorWeight = new Map<string, number>([
	["-", 0],
	["+", 0],
	["*", 1],
	["/", 1],
	["^", 2]
]);

const maxOpLength: number = 4; // Length of the longest operator
const functions = new Map<string, string>([ // TODO: factorial, log, abs
	["sin", "sin"],
	["cos", "cos"],
	["tan", "tan"],
	["cot", "cot"],
	["asin", "asin"],
	["acos", "acos"],
	["atan", "atan"],
	["acot", "acot"],
	["log", "log"],
	["ln", "ln"],
	["fact", "fact"],
	["abs", "abs"]
]);

function tryReadNum(input: string): number {
	let num = "";
	let isDecimal = false;
	for (let i = 0; i < input.length; i++) {
		let current = parseInt(input[i]);

		if (!isNaN(current)) {
			num += current;
			continue;
		}

		if (!isDecimal && input[i] === ".") {
			isDecimal = true;
			num += ".";
			continue;
		}

		break;
	}

	return parseFloat(num);
}

function tryReadFunc(input: string): string | undefined {
	for (let i = 1; i < Math.min(maxOpLength + 1, input.length); i++) {
		const slice = input.slice(0, i);
		const func = functions.get(slice);
		if (func !== undefined) {
			return func;
		}
	}

	return undefined;
}

export function parse(input: string): Equation {
	input = input.split(" ").join("").toLowerCase();
	let result: Equation = [];
	let operators: Array<string> = [];

	while (input.length > 0) {
		let num = tryReadNum(input);
		if (!isNaN(num)) {
			result.push(num);
			input = input.slice(num.toString().length);
			continue;
		}

		let func = tryReadFunc(input);
		if (typeof func === 'string') {
			operators.push(func);
			input = input.slice(func.length);
			continue;
		}

		if (input[0] == "x") {
			result.push("x");
			input = input.slice(1);
			continue;
		}

		if (input[0] == ")") {
			while (operators[operators.length - 1] != "(") {
				result.push(operators.pop()!);
			}
			operators.pop();

			input = input.slice(1);
			continue;
		}

		if (input[0] == "(" ||
			input[0] == "^" ||
			operators.length == 0 ||
			operators[operators.length - 1] == "(" ||
			operatorWeight.get(operators[operators.length - 1])! < operatorWeight.get(input[0])!) {

			operators.push(input[0]);
			input = input.slice(1);
			continue;
		}

		result.push(operators.pop()!);
		operators.push(input[0]);
		input = input.slice(1);
	}

	while (operators.length > 0) {
		result.push(operators.pop()!);
	}

	return result;
}