'use client';

import React from 'react';

import { useActionState } from 'react';

import FormSubmit from './form-submit';

interface ChildrenProps {
    action: any;
    children: React.ReactNode | React.ReactNode[];
}

export default function ItemForm({ action, children }: ChildrenProps) {
  const [state, formAction] = useActionState(action, {
    errors: null
  });

  return (
    <>
      <div className='font-bold mb-2'>
        <h1>Create a new Item</h1>
      </div>
      <form action={formAction}>
        <div className="form-control">
          <label className="mt-2" htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
          <label className="mt-2" htmlFor="units">Units</label>
          <input type="text" id="units" name="units" />
          <label className="mt-2" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} />
        </div>
        <div className="form-control">
          <label className="mt-2" htmlFor="categories">Select Category:</label>
        </div>
        {children}
        <div className="form-actions">
          <FormSubmit />
        </div>
        {state.errors && (
          <ul className="form-errors">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}
