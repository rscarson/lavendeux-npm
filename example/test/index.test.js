import { test, expect, describe } from 'vitest';
import '../src/index';

describe('Extension', () => {
    test('registered', () => {

    });

    test('add(left, right)', () => {
        let f = globalThis.extension().getFunctionCallback('add');
        expect(f(2, 3)).toStrictEqual(5);
    });
    
    test('@usd', () => {
        let f = globalThis.extension().getDecoratorCallback('usd');
        expect(f(2)).toStrictEqual('$2.00');
    });
});