'use client';

import { useActionState } from 'react';

import FormSubmit from './form-submit';
import FormFeedback from './form-feedback';
import { INITIAL_FORM_STATE, type FormState } from '../lib/form-state';

type CategoryFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

export default function CategoryForm({ action }: CategoryFormProps) {

  const [state, formAction] = useActionState(action, INITIAL_FORM_STATE);

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
      </form>
      <FormFeedback state={state} />
    </>
  );
}
