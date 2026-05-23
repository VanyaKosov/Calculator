# Calculator

This is a simple graphing calculator app.

## Features

* Graphing functions in terms of $x$.
* Equation input allows spaces and is NOT case sensitive.
* Resizable view window.
* Graph can be zoomed in and out by using the mouse wheel.
* Graph can be moved by dragging with the mouse.
* Root finding using Newton's method.
* Rendering of discontinuous functions.
* Derivative approximation and tangent line graphing.
* Function evaluation at a given $x$ value.
* `sin`, `cos`, `tan` and `cot` functions are approximated with a 32-degree Taylor polynomial.

### Supported Operations

* `a ^ b` - a to the power of b (see [limitations](#limitations))
* `a + b`
* `a - b`
* `a / b`
* `a * b`
* `sin(x)`
* `cos(x)`
* `tan(x)`
* `cot(x)`
* `asin(x)`
* `acos(x)`
* `atan(x)`
* `acot(x)`
* `ln(x)`
* `log(a, b)` - $log_ab$
* `abs(x)` - $|x|$
* `fact(x)` - $x!$
* `pow(a, b, c)` - $a^{\frac{b}{c}}$ (see [limitations](#limitations))

### Constants

* `e` - Euler's number
* `pi` - $\pi$
* Numbers must be written in format: `123`; `12.3`; `0.123`; `-0.123`; `.123`; `-.123`

## Limitations

* The precision of the calculator is 8 decimals.
* When using `^` operator, fractional exponents will be defined only for positive $x$ values. To calculate fractional exponents for all $x$ values, use `pow` function.
* No implicit operations. `2x` must be written as `2*x`.
* Number input in scientific notation is not supported.
* Error "Incorrect equation" means that either the equation entered is incorrect, or the derivative at the specified point cannot be calculated.

## Sources

[Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method)

[Reverse Polish notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation)

[Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)

[Colour palette](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/mit18_s096iap23_lec08.pdf)
