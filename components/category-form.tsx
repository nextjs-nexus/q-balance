'use client';

import { useActionState } from 'react';

import FormSubmit from './form-submit';

export default function CategoryForm( {action}) {

  const [state, formAction] = useActionState(action, {
    errors: null
  });

  return (
    <>
      <div className='font-semibold mb-2'>
        <h1>Create a new Category</h1>
      </div>
      <form action={formAction}>
        <p className="form-control font-normal">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} />
        </p>
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
      </form>
    </>
  );
}
