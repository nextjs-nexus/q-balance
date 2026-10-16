import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDiscountedPrice } from '../lib/transaction-discount';

test('blank discounts and income leave prices unchanged', () => {
  assert.equal(calculateDiscountedPrice('2', '3', '10', ' '), null);
  assert.equal(calculateDiscountedPrice('1', '3', '10', '5'), null);
});

test('discount is applied to the full quantity before recalculating unit price', () => {
  assert.deepEqual(calculateDiscountedPrice('2', '4', '5', '3'), { price: 4.25, total: 17 });
  assert.deepEqual(calculateDiscountedPrice('2', '0.5', '10', '1'), { price: 8, total: 4 });
  assert.deepEqual(calculateDiscountedPrice('2', '3', '10', '30'), { price: 0, total: 0 });
  assert.deepEqual(calculateDiscountedPrice('2', '3', '10', '0'), { price: 10, total: 30 });
  const result = calculateDiscountedPrice('2', '3', '10', '1');
  assert.ok(result && 'price' in result);
  assert.ok(Math.abs(result.price * 3 - 29) < 1e-10);
});

test('invalid discounts or quantities return validation errors', () => {
  for (const [quantity, price, discount] of [
    ['0', '10', '1'], ['-1', '10', '1'], ['abc', '10', '1'],
    ['1', '', '1'], ['1', '-10', '1'], ['1', '10', '-1'],
    ['1', '10', '11'], ['1', '10', 'abc'], ['1', '10', 'Infinity'],
  ]) {
    const result = calculateDiscountedPrice('2', quantity, price, discount);
    assert.ok(result && 'error' in result);
  }
});
