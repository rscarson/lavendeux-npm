import { Lavendeux } from 'lavendeux';
import { test, expect, describe } from 'vitest';
import '../src/index';

describe('Extension', () => {
    test('add(left, right)', () => {
        let f = Lavendeux.registeredInstance().getFunctionCallback('add');
        expect(
            f(2, 3)
        ).toStrictEqual(5);
    });
    
    test('@usd', () => {
        let f = Lavendeux.registeredInstance().getDecoratorCallback('usd');
        expect(
            f(2)
        ).toStrictEqual('$2.00');
    });
});