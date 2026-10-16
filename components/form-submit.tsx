"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

type FormStatusType = {
  pending: boolean;
}

export default function FormSubmit() {

  const router = useRouter();

  function handleBack(){
    router.back();
  }

  const status: FormStatusType = useFormStatus();

  if (status.pending) {
    return <p>Creating...</p>;
  }

  return (
    <div className="flex flex-row justify-between w-full">
      <div>
        <button onClick={handleBack}>&lt;&lt; Back</button>
      </div>
      <div>
        <button className="mr-4" type="reset">Reset</button>
        <button>Create</button>
      </div>
    </div>
  );
}
