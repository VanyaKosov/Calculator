const taylorDegree = 32;
const precision = 1 / (10 ** 10)

export function sign(n: number): number {
    if (n < 0) return -1;
    return 1;
}

export function fact(n: number): number {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}

export function sin(n: number): number {
    n = n - Math.floor(n / (2 * Math.PI)) * 2 * Math.PI; // limit angle to -2PI / 2PI

    let result = 0;
    let derivative = 1;
    for (let i = 1; i <= taylorDegree; i += 2) {
        result += derivative * (n ** i) / fact(i);
        derivative *= -1;
    }

    return result;
}

export function cos(n: number): number {
    n = n - Math.floor(n / (2 * Math.PI)) * 2 * Math.PI; // limit angle to -2PI / 2PI

    let result = 0;
    let derivative = 1;
    for (let i = 0; i <= taylorDegree; i += 2) {
        result += derivative * (n ** i) / fact(i);
        derivative *= -1;
    }

    return result;
}

export function tan(n: number): number {
    let sinVal = sin(n);
    if (Math.abs(sinVal) < precision) return 0;
    let cosVal = cos(n);
    if (Math.abs(cosVal) < precision) return sign(sinVal) * Infinity;

    return sin(n) / cos(n);
}

export function cot(n: number): number {
    let cosVal = cos(n);
    if (Math.abs(cosVal) < precision) return 0;
    let sinVal = sin(n);
    if (Math.abs(sinVal) < precision) return sign(cosVal) * Infinity;

    return cos(n) / sin(n);
}

export function asin(n: number): number {
    return Math.asin(n);
}

export function acos(n: number): number {
    return Math.acos(n);
}

export function atan(n: number): number {
    return Math.atan(n);
}

export function acot(n: number): number {
    return 1 / Math.atan(n);
}

export function log(base: number, arg: number): number {
    return Math.log(arg) / Math.log(base);
}

export function abs(a: number): number {
    return Math.abs(a);
}