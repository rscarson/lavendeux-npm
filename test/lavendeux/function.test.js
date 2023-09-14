import { test, expect, describe } from 'vitest';
import { Types } from '../../src/lavendeux/value';
import { LavendeuxFunction } from '../../src/lavendeux/function';
import { Lavendeux } from '../../src/lavendeux/index';

// Set up the extension globals
new Lavendeux('test', 'test');

describe('LavendeuxFunction', () => {
    test('getRegisteredName', () => {
        let s1 = LavendeuxFunction.getRegisteredName('test');
        expect(s1).toContain('lavendeuxfunction_test');
        expect(s1).not.toBe(LavendeuxFunction.getRegisteredName('test'));
    });
    
    test('addArgument', () => {
        let func = new LavendeuxFunction('test', Types.String, () => {return 5;});
        expect(func.argumentTypes.length).toBe(0);

        func.addArgument();
        expect(func.argumentTypes.pop()).toBe(Types.Any);

        func.addArrayArgument();
        expect(func.argumentTypes.pop()).toBe(Types.Array);

        func.addBooleanArgument();
        expect(func.argumentTypes.pop()).toBe(Types.Boolean);

        func.addFloatArgument();
        expect(func.argumentTypes.pop()).toBe(Types.Float);

        func.addIntegerArgument();
        expect(func.argumentTypes.pop()).toBe(Types.Integer);

        func.addNumericArgument();
        expect(func.argumentTypes.pop()).toBe(Types.Numeric);

        func.addObjectArgument();
        expect(func.argumentTypes.pop()).toBe(Types.Object);

        func.addStringArgument();
        expect(func.argumentTypes.pop()).toBe(Types.String);
    });
    
    test('call', () => {
        let result = false;
        let func = new LavendeuxFunction('test', Types.Any, () => {result = true;})
        .addIntegerArgument();

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

        globalThis._state = {};
        globalThis.getState = () => {
            return globalThis._state;
        }
        globalThis.setState = (state) => {
            globalThis._state = state;
        }
        
        setState({'foo': {'String': 'bar'}});
        func = new LavendeuxFunction('test', Types.Any, (state) => {
            expect(state.foo).toBe('bar');
            state.foo = 'bar2';
        });
        func.call([]);
        expect(getState().foo).toStrictEqual({'String': 'bar2'});
    });
});