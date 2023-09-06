import { test, expect, describe } from 'vitest';
import { Lavendeux } from '../index';

function usdDecorator(input) {
    let n = (Math.round(input * 100) / 100).toFixed(2);
    return `$${n}`;
}

function addFunction(left, right) {
    return left + right;
}

function statefulFunction() {
    if (!state.nextInt) state.nextInt = 0;
    return state.nextInt++;
}

describe('Lavendeux', () => {
    test('Example', () => {
        const extension = Lavendeux.fromPackage();

        extension.addNumericDecorator('usd', usdDecorator);
        extension.addFunction('add', addFunction)
            .addNumericArgument()
            .addNumericArgument();

        expect(Object.keys(globalThis.extension.functions).length).toBe(1);
        expect(Object.keys(globalThis.extension.decorators).length).toBe(1);
        
        expect(globalThis.lavendeuxfunction_add([
            {'Integer': 2}, {'Integer': 3}, 
        ])).toStrictEqual({'Integer': 5});
        
        expect(globalThis.lavendeuxdecorator_usd([
            {'Integer': 2}, {'Integer': 3}, 
        ])).toStrictEqual({'String': '$2.00'});
    });
    
    test('State', () => {
        const extension = Lavendeux.fromPackage();
        extension.addFunction('next', statefulFunction);

        globalThis.state = {};
        globalThis.getState = () => {
            return globalThis.state;
        }
        globalThis.setState = (state) => {
            globalThis.state = state;
        }
        
        expect(
            globalThis.lavendeuxfunction_next([])
        ).toStrictEqual({'Integer': 0});
        
        expect(
            globalThis.lavendeuxfunction_next([])
        ).toStrictEqual({'Integer': 1});
        
        expect(
            globalThis.lavendeuxfunction_next([])
        ).toStrictEqual({'Integer': 2});
    });
});