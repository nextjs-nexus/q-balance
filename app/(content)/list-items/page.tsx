import Image from "next/image.js";

import { getItems } from "../../../lib/transactions-mariadb";

type ArrayOfObjects = {
  id: number;
  title: string;
  units: string;
  description: string;
}[];

export default async function ListItems(){

    const allItems: ArrayOfObjects = await getItems();
  
    return (
        <main className='bg-balance-surface'>
            <table cellPadding={2} className="w-full">
                <thead>
                    <tr className="border-b border-balance-border bg-balance-accent py-2">
                        <td className="font-semibold py-2 px-2">Name</td>
                        <td className="font-semibold py-2">Units</td>
                        <td className="px-3 font-semibold">Description</td>
                        <td className="px-3 font-semibold"></td>
                    </tr>
                </thead>
                <tbody>
                    {allItems.map((item) => (
                        <tr className="border-b border-balance-border even:bg-balance-soft py-2" key={item.id}>
                            <td className="px-2">{item.title}</td>
                            <td>{item.units}</td>
                            <td className="py-2 px-2">{item.description}</td>
                            <td>
                                <a href={`/list-items/${item.id}`}>
                                    <Image src="/edit.svg" alt="Edit" className="[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(19%)_saturate(1020%)_hue-rotate(110deg)]" width={20} height={20}/>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );


/*    
    return (
        <main>
            <div id="list-items">
                {allItems.map((item) => (
                    <div id="one-item" key={item.id}>{item.title}</div>
                ))}
            </div>
        </main>
    );
*/

};
