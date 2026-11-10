// State returned by the data Server Actions and shown by the forms.
export type FormState = {
  errors: string[] | null;
  loginRequired?: boolean;
  demoAvailable?: boolean;
};

export const INITIAL_FORM_STATE: FormState = {
  errors: null,
};
