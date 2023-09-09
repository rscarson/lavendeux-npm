import { test, expect, describe } from 'vitest';
import { Types } from '../../src/lavendeux/value';
import { LavendeuxFunction } from '../../src/lavendeux/function';
import { Lavendeux } from '../../src/lavendeux/index';

// Set up the extension globals
new Lavendeux('test', 'test');

globalThis.state = {};
globalThis.getState = () => {
    return globalThis.state;
}
globalThis.setState = (state) => {
    globalThis.state = state;
}

describe('LavendeuxFunction', () => {
    test('registeredName', () => {
        let func = new LavendeuxFunction('test', Types.Any, () => {});
        expect(func.registeredName()).toBe('lavendeuxfunction_test');
    });
    
    test('_addArgument', () => {
        let func = new LavendeuxFunction('test', Types.String, () => {return 5;});
        expect(func.call([])).toStrictEqual({'String': '5'});

        func.addArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.Any);

        func.addArrayArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.Array);

        func.addBooleanArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.Boolean);

        func.addFloatArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.Float);

        func.addIntegerArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.Integer);

        func.addNumericArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.Numeric);

        func.addObjectArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.Object);

        func.addStringArgument();
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].type)
            .toBe(Types.String);

        func.addArgument(true);
        expect(globalThis.lavendeuxfunction_test_args[globalThis.lavendeuxfunction_test_args.length - 1].optional)
            .toBe(true);
            
        expect(() => {
            func.addArgument(true);
        }).toThrowError();
    });
    
    test('call', () => {
        let result = false;
        let func = new LavendeuxFunction('test', Types.Any, () => {result = true;})
        .addIntegerArgument()
        .addStringArgument(true);

        func.call([
            {'Integer': 5}
        ]);
        expect(result).toBe(true);

        result = false;
        func.call([
            {'Integer': 5},
            {'Integer': 5}
        ]);
        expect(result).toBe(true);

        result = false;
        expect(() => {
            func.call([]);
        }).toThrowError();
        expect(result).toBe(false);

        result = false;
        expect(() => {
            func.call([
                {'String': '5'}
            ]);
        }).toThrowError();
        expect(result).toBe(false);
        
        result = false;
        func = new LavendeuxFunction('test', Types.Any, () => {result = true;});
        func.call([
            {'Integer': 5}
        ]);
        expect(result).toBe(true);

        result = false;
        delete globalThis.getState;
        delete globalThis.setState;
        func.call([
            {'Integer': 5}
        ]);
        expect(result).toBe(true);

        globalThis.state = {};
        globalThis.getState = () => {
            return globalThis.state;
        }
        globalThis.setState = (state) => {
            globalThis.state = state;
        }
    });
    
    test('register', () => {
        let result = false;
        let func = new LavendeuxFunction('test', Types.Any, () => {result = true;});
        expect(globalThis.extensionDetails.functions.test).toBe('lavendeuxfunction_test');
        expect(typeof globalThis.lavendeuxfunction_test).toBe('function');
        expect(globalThis.lavendeuxfunction_test_args).toStrictEqual([]);
        
        globalThis.lavendeuxfunction_test([{'Integer': 1}]);
        expect(result).toBe(true);
    });
});