import { name, author, version } from '../package.json';
import { Lavendeux } from 'lavendeux';

// Create a new extension from the configuration in package.json
let instance = new Lavendeux(name, author, version);

/**
 * Formats a given value as a string
 * A decorator that accepts a numeric value
 * Can be called from Lavendeux with @usd
 * @param {Number} input The value to decorate
 * @returns Formatted result
 */
instance.addNumericDecorator('usd', (input: number) => {
    let n = (Math.round(input * 100) / 100).toFixed(2);
     return `$${n}`;
});

/**
 * A function accepting 2 numeric arguments
 * Can be called from Lavendeux with add(5, 3)
 * @param {Number} left An argument to the function
 * @param {Number} right An argument to the function
 * @returns The resulting value
 */
instance.addFunction('add', (left: number, right: number) => {
    return left + right;
})
.addNumericArgument()
.addNumericArgument();

// Make the extension visible to the lavendeux parser
Lavendeux.register(instance);