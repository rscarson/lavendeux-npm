This package provides an interface for creating lavendeux extensions.

The lavendeux-parser is a parsing engine for rust, acting as the backend for [Lavendeux](https://rscarson.github.io/lavendeux/)

Create a new extension using `npx lavendeux init`. The extension can be compiled for use with Lavendeux using `npx lavendeux build`

The parser supports runtime loaded JS extensions for adding functionality in 2 ways:
- Functions, which can be called like so: `add(2, 3)`
- Decorators, which format the output of a statement and can be called like so: `22 @usd`

Below is a simple example of an extension that would implement the add() and @usd features above:
```javascript
import { name, author, version } from './package.json';
import { Lavendeux } from 'lavendeux';

function usdDecorator(input) {
    let n = (Math.round(input * 100) / 100).toFixed(2);
     return `$${n}`;
}

function addFunction(left, right) {
     return left + right;
}

let extension = new Lavendeux(name, author, version);
extension.addNumericDecorator('usd', usdDecorator);
extension.addFunction('add', addFunction)
    .addNumericArgument()
    .addNumericArgument();
```

Functions can also access variables set from within Lavendeux, in order to act statefully:
```javascript
import { name, author, version } from './package.json';
import { Lavendeux } from 'lavendeux';

function statefulFunction() {
    return state.nextInt++;
}

let extension = new Lavendeux(name, author, version);
extension.addFunction('next', statefulFunction);
```

Function arguments can be any of the following:
- addIntegerArgument: Supplied value must be numeric, and will be coorced to int
- addFloatArgument:   Supplied value must be numeric, and will be coorced to a float
- addNumericArgument: Supplied value can be a float or integer 
- addStringArgument:  Supplied value will be cooerced to string
- addBooleanArgument: Supplied value will be cooerced to boolean
- addArrayArgument:   Supplied value will be cooerced into an array
- addObjectArgument:  Supplied value will be cooerced into an object
- addArgument:        Any type is accepted, and no type cooersion occurs

Additionally, each of the above functions takes in an optional boolean to indicate that the parameter is optional.

Note that only the last parameter may be optional

Similarly, decorators are also typed using the same rules as above, and can be one of the following:
- addIntegerDecorator: Supplied value must be numeric, and will be coorced to int
- addFloatDecorator:   Supplied value must be numeric, and will be coorced to a float
- addNumericDecorator: Supplied value can be a float or integer 
- addStringDecorator:  Supplied value will be cooerced to string
- addBooleanDecorator: Supplied value will be cooerced to boolean
- addArrayDecorator:   Supplied value will be cooerced into an array
- addObjectDecorator:  Supplied value will be cooerced into an object
- addDecorator:        Any type is accepted, and no type cooersion occurs