export type Equation = (number | string)[];

const operatorWeight = new Map<string, number>([
	["-", 0],
	["+", 0],
	["*", 1],
	["/", 1],
	["^", 2]
]);

const maxOpLength: number = 4; // Length of the longest operator
const functions = new Map<string, number>([ // Value is number of parameters
	["sin", 1],
	["cos", 1],
	["tan", 1],
	["cot", 1],
	["asin", 1],
	["acos", 1],
	["atan", 1],
	["acot", 1],
	["log", 1], // TODO: any base
	["ln", 1],
	["fact", 1],
	["abs", 1],
	["pow", 3],
	["pi", 0],
	["e", 0]
]);

function tryReadNum(input: string): string {
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

	return num;
}

function tryReadFunc(input: string): string | undefined {
	for (let i = 1; i <= Math.min(maxOpLength, input.length); i++) {
		const slice = input.slice(0, i);
		const func = functions.get(slice);
		if (func !== undefined) {
			return slice;
		}
	}

	return undefined;
}

function tokenize(input: string): Equation { // temp export
	let result: Equation = [];

	while (input.length > 0) {
		if (input[0] == "-") {
			if (result.length > 0) {
				if (result[result.length - 1] != "(" && result[result.length - 1] != ",") {
					result.push("+");
				}
			}
			result.push(-1, "*");
			input = input.slice(1);
			continue;
		}

		if (operatorWeight.get(input[0]) !== undefined
			|| input[0] === "x"
			|| input[0] == "("
			|| input[0] == ")"
			|| input[0] == "^"
			|| input[0] == ",") {
			result.push(input[0]);
			input = input.slice(1);
			continue;
		}

		let func = tryReadFunc(input);
		if (func !== undefined) {
			if (func === "pi") {
				result.push(Math.PI);
			} else if (func === "e") {
				result.push(Math.E);
			} else {
				result.push(func);
			}

			input = input.slice(func.length);
			continue;
		}

		let num = tryReadNum(input);
		let parsedNum = parseFloat(num);
		if (!isNaN(parsedNum)) {
			result.push(parsedNum);
			input = input.slice(num.length);
			continue;
		}

		throw "Incorrect equation";
	}

	return result;
}

export function parse(input: string): Equation {
	input = input.split(" ").join("").toLowerCase();
	const tokens = tokenize(input);
	let result: Equation = [];
	let operators: string[] = [];

	for (let token of tokens) {
		if (token === ",") {
			continue;
		}

		if (typeof token === "number" || token === "x") {
			result.push(token);
			continue;
		}

		if (token == ")") {
			while (operators[operators.length - 1] != "(") {
				if (operators.length == 0) throw "Incorrect equation";
				result.push(operators.pop()!);
			}
			operators.pop();

			continue;
		}

		if (functions.get(token) !== undefined ||
			token == "(" ||
			token == "^" ||
			operators.length == 0 ||
			operators[operators.length - 1] == "(" ||
			operatorWeight.get(operators[operators.length - 1])! < operatorWeight.get(token)!) {
			operators.push(token);
			continue;
		}

		result.push(operators.pop()!);
		operators.push(token);
	}

	while (operators.length > 0) {
		const val = operators.pop()!;
		if (val === '(') throw "Incorrect equation";
		result.push(val);
	}

	return result;
}