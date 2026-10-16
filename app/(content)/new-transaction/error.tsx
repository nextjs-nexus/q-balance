'use client';

type Error = {
  message: string;
};

export default function NewExpenseError( error: Error) {
  return (
    <>
      <h2>An error occurred!</h2>
      <p>Unfortunately, something went wrong.</p>
      <p>{error.message}</p>
    </>
  );
}
