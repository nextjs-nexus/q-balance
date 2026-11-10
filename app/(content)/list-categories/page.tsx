import Image from "next/image.js";

import { getCategories } from "../../../lib/transactions-mariadb";

type ArrayOfObjects = {
  id: number;
  title: string;
  description: string;
}[];

export default async function ListCategories(){

    const allCategories: ArrayOfObjects = await getCategories();

    return (
        <main className='bg-balance-surface'>
            <table cellPadding={2} className="w-full">
                <thead>
                    <tr className="border-b border-balance-border bg-balance-accent py-2">
                        <td className="font-semibold py-2 px-2">Name</td>
                        <td className="px-3 font-semibold">Description</td>
                        <td className="px-3 font-semibold"></td>
                    </tr>
                </thead>
                <tbody>
                    {allCategories.map((category) => (
                        <tr className="border-b border-balance-border even:bg-balance-soft" key={category.id}>
                            <td className="px-2">{category.title}</td>
                            <td className="px-2 py-2">{category.description}</td>
                            <td>
                                <a href={`/list-categories/${category.id}`}>
                                    <Image src="/edit.svg" alt="Edit" className="[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(19%)_saturate(1020%)_hue-rotate(110deg)]" width={20} height={20}/>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );

};
