'use client';

import { useFormStatus } from 'react-dom';

import { demoSignInAction } from '../actions/auth';
import { cn } from '../lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'link' | 'plain';

const variantClasses: Record<Variant, string> = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-full !bg-balance-primary !px-6 !py-3.5 text-sm font-medium !text-white hover:!bg-balance-hover',
  secondary: 'inline-flex w-full items-center justify-center rounded-md border border-balance-primary !bg-balance-surface !px-4 !py-2.5 text-sm font-semibold !text-balance-primary hover:!bg-balance-soft',
  outline: 'inline-flex items-center justify-center rounded-full border border-balance-primary/25 !bg-transparent !px-6 !py-3.5 text-sm font-medium !text-balance-primary hover:!bg-balance-soft',
  link: 'inline !bg-transparent !p-0 text-sm font-medium !text-balance-primary underline underline-offset-4 hover:!text-balance-hover',
  plain: 'hover:!bg-balance-hover',
};

function SubmitButton({ variant, label }: { variant: Variant; label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(variantClasses[variant], 'disabled:cursor-wait disabled:opacity-70')}
    >
      {pending ? 'Opening demo…' : label}
    </button>
  );
}

// Signs the visitor in to the shared demo account, then opens `next`.
export default function DemoSignInButton({
  next = '/dashboard',
  variant = 'primary',
  label = 'Try the demo account',
}: {
  next?: string;
  variant?: Variant;
  label?: string;
}) {
  return (
    <form action={demoSignInAction} className={variant === 'secondary' ? 'w-full' : 'inline'}>
      <input type="hidden" name="next" value={next} />
      <SubmitButton variant={variant} label={label} />
    </form>
  );
}
