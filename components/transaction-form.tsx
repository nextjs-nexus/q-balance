'use client';

import React from 'react';
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from 'react';
import { calculateDiscountedPrice } from '../lib/transaction-discount';

import FormSubmit from './form-submit';
import TransactionTypeRadio from './transaction-type-radio';

interface ChildrenProps {
    action: any;
    children: React.ReactNode | React.ReactNode[];
}

export default function TransactionForm({ action, children }: ChildrenProps) {

  const [state, formAction] = useActionState(action, {
    errors: null
  });

  const searchParams = useSearchParams()
  const [type, setType] = useState(searchParams.get('type') === '1' ? '1' : '2');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const discounted = calculateDiscountedPrice(type, quantity, price, discount);

  return (
    <>
      <div className='font-bold mb-4'>
        <h1>Create a new Transaction</h1>
      </div>
      <form action={formAction}>
          <div className="form-control">
            <TransactionTypeRadio type={type} onChange={setType} />
            <label className="mt-2">Select Item:</label>
            {children}
            <label className="mt-2" htmlFor="quantity">Quantity</label>
            <input
              type="text"
              inputMode="decimal"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
            <label className="mt-2" htmlFor="price">Price</label>
            <input
              type="text"
              inputMode="decimal"
              id="price"
              name="price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
            {type === '2' && (
              <>
                <label className="mt-2" htmlFor="discount">Discount amount (optional)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  id="discount"
                  name="discount"
                  value={discount}
                  onChange={(event) => setDiscount(event.target.value)}
                  aria-describedby="discount-help"
                />
                <p id="discount-help" className="text-sm text-balance-muted">
                  Enter the discount for the entire quantity. The saved unit price is
                  (price × quantity − discount) ÷ quantity. Leave blank for no discount.
                </p>
                {discounted && (
                  <p aria-live="polite" className="mt-2 text-sm text-balance-muted">
                    {'error' in discounted
                      ? discounted.error
                      : `Discounted unit price: ${discounted.price.toFixed(2)} · Total: ${discounted.total.toFixed(2)}`}
                  </p>
                )}
              </>
            )}
            <label className="mt-2" htmlFor="comments">Comments</label>
            <textarea id="comments" name="comments" rows={5} />
            <div className="form-actions">
              <FormSubmit />            
            </div>
            {state.errors && (
              <ul className="form-errors">
                {state.errors.map((error: string) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
      </form>
    </>
  );

   
    
}