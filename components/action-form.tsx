'use client';

import React, { useActionState } from 'react';

import FormFeedback from './form-feedback';
import { INITIAL_FORM_STATE, type FormState } from '../lib/form-state';

type ActionFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
};

// Lets server-rendered edit pages show validation errors and the login notice.
export default function ActionForm({ action, children }: ActionFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_FORM_STATE);

  return (
    <>
      <form action={formAction}>
        {children}
      </form>
      <FormFeedback state={state} />
    </>
  );
}
