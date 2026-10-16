import Image from "next/image.js";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "../../../lib/auth";

import { getCategories } from "../../../lib/transactions-mariadb";

type ArrayOfObjects = {
  id: number;
  title: string;
  description: string;
}[];

export default async function ListCategories(){

    const allCategories: ArrayOfObjects = await getCategories();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl font-bold">Q-Balance</h1>
            <div className="form-controls flex gap-4 mt-8">
                <Link href="/signup">Sign Up</Link>
                <Link href="/signin">Sign In</Link>
            </div>
            </div> 
        );
    }

    return (
        <main className='bg-white'>
            <table cellPadding={2} className="w-full">
                <thead>
                    <tr className="border-b border-gray-300 odd:bg-slate-300 py-2">
                        <td className="font-semibold py-2 px-2">Name</td>
                        <td className="px-3 font-semibold">Description</td>
                        <td className="px-3 font-semibold"></td>
                    </tr>
                </thead>
                <tbody>
                    {allCategories.map((category) => (
                        <tr className="border-b border-gray-300 even:bg-gray-200" key={category.id}>
                            <td className="px-2">{category.title}</td>
                            <td className="px-2 py-2">{category.description}</td>
                            <td>
                                <a href={`/list-categories/${category.id}`}>
                                    <Image src="/edit.svg" alt="Edit" style={{ filter: 'invert(5%) sepia(100%) saturate(10000%) hue-rotate(200deg)' }} width={20} height={20}/>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );

};
