'use client';

import { useRouter } from "next/navigation";

export default function ButtonBack(){

    const router = useRouter();
  
    function handleBack(){
        router.back();
    }

    return (
        <button onClick={handleBack}>&lt;&lt; Back</button>
    );
    
}