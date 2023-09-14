import { test, expect, describe } from 'vitest';
import '../src/index';

describe('Extension', () => {
    test('add(left, right)', () => {
        expect(globalThis.lavendeuxfunction_add([
            {'Integer': 2}, {'Integer': 3}, 
        ])).toStrictEqual({'Integer': 5});
    });
    
    test('@usd', () => {
        expect(globalThis.lavendeuxdecorator_usd([
            {'Integer': 2}, 
        ])).toStrictEqual({'String': '$2.00'});
    });
});