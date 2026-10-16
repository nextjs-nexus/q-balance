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
        <main className='bg-white'>
            <table cellPadding={2} className="w-full">
                <thead>
                    <tr className="border-b border-gray-300 odd:bg-slate-300 py-2">
                        <td className="font-semibold py-2 px-2">Name</td>
                        <td className="font-semibold py-2">Units</td>
                        <td className="px-3 font-semibold">Description</td>
                        <td className="px-3 font-semibold"></td>
                    </tr>
                </thead>
                <tbody>
                    {allItems.map((item) => (
                        <tr className="border-b border-gray-300 even:bg-gray-200 py-2" key={item.id}>
                            <td className="px-2">{item.title}</td>
                            <td>{item.units}</td>
                            <td className="py-2 px-2">{item.description}</td>
                            <td>
                                <a href={`/list-items/${item.id}`}>
                                    <Image src="/edit.svg" alt="Edit" style={{ filter: 'invert(5%) sepia(100%) saturate(10000%) hue-rotate(200deg)' }} width={20} height={20}/>
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
