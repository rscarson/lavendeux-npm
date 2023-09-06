This package provides an interface for creating lavendeux extensions.

The lavendeux-parser is a parsing engine for rust, acting as the backend for [Lavendeux](https://rscarson.github.io/lavendeux/)

The parser supports runtime loaded JS extensions for adding functionality in 2 ways:
- Functions, which can be called like so: `add(2, 3)`
- Decorators, which format the output of a statement and can be called like so: `22 @usd`

Below is a simple example of an extension that would implement the add() and @usd features above:
```javascript
function usdDecorator(input) {
    let n = (Math.round(input * 100) / 100).toFixed(2);
     return `$${n}`;
}

function addFunction(left, right) {
     return left + right;
}

extension.addNumericDecorator('usd', usdDecorator);
extension.addFunction('add', addFunction)
    .addNumericArgument()
    .addNumericArgument();
```

Functions can also access variables set from within Lavendeux, in order to act statefully:
```javascript
function statefulFunction() {
    return state.nextInt++;
}

extension.addFunction('next', statefulFunction);
```