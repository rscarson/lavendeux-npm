import { test, expect, describe } from 'vitest';
import { Types } from '../../src/lavendeux/value';
import { LavendeuxDecorator } from '../../src/lavendeux/decorator';
import { Lavendeux } from '../../src/lavendeux/index';

// Set up the extension globals
new Lavendeux('test', 'test');

describe('LavendeuxDecorator', () => {
    test('constructor', () => {
        let func = new LavendeuxDecorator('test', Types.Any, () => {});
        expect(globalThis.lavendeuxdecorator_test_args.length).toBe(1);
        expect(func.returnType).toBe(Types.String);
        expect(func.args[0].type).toBe(Types.Any);
    });
    
    test('registeredName', () => {
        let func = new LavendeuxDecorator('test', Types.Any, () => {});
        expect(func.registeredName()).toBe('lavendeuxdecorator_test');
    });
    
    test('register', () => {
        let result = false;
        let func = new LavendeuxDecorator('test', Types.Any, () => {result = true;});
        expect(globalThis.extensionDetails.decorators.test).toBe('lavendeuxdecorator_test');
        expect(typeof globalThis.lavendeuxdecorator_test).toBe('function');
        expect(globalThis.lavendeuxdecorator_test_args.length).toBe(1);

        globalThis.lavendeuxdecorator_test([{'Integer': 1}]);
        expect(result).toBe(true);
    });
});