const operatorWeight = new Map<string, number>([
	["-", 0],
	["+", 0],
	["*", 1],
	["/", 1],
	["^", 2]
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
		}

		break;
	}

	return parseFloat(num);
}

export function parse(input: string): (number | string)[] {
	input = input.split(" ").join("");
	let result: (number | string)[] = [];
	let operators: Array<string> = [];

	while (input.length > 0) {
		let num = tryReadNum(input);
		if (!isNaN(num)) {
			result.push(num);
			input = input.slice(num.toString().length);
			continue;
		}

		if (input[0] == "x") {
			result.push("x");
			input = input.slice(1);
			continue;
		}

		// TODO: operators longer then 1 character

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