import Image from "next/image.js";

import { getCategories, getTransactions } from "../../../lib/transactions-mariadb";
import { formatPrice, formatQuantity } from "../../utils/utils.js";
import TransactionsFilter from "../../../components/transactions-filter";

type ArrayOfObjects = {
  id: number;
  title: string;
}[];

type ArrayOfObjectsTransactions = {
  id: number;
  title: string;
  quantity: number;
  price: number;
}[];

const ListTransactions = async ( {searchParams}: { searchParams: Promise<{date_from: string, date_to: string, category_id:string, type:string}>} ) => {

    const {date_from, date_to, category_id, type} = await searchParams;

    const allCategories: ArrayOfObjects = await getCategories();

    const allTransactions: ArrayOfObjectsTransactions = await getTransactions( date_from, date_to, category_id, type );

    let totalAmount: number = 0;

    allTransactions.map((transaction) => {
        totalAmount = totalAmount + transaction.quantity * transaction.price;
    });

    let totalAmountString: string = formatPrice(totalAmount);

    return (
        <main className='bg-white'>
            <div>
                <TransactionsFilter date_from={date_from} date_to={date_to} all_categories={allCategories} list_type="list-transactions"/>
            </div>
            <div className="h-3"></div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-300 odd:bg-slate-300 py-2">
                        <td className="font-bold py-2 px-2">
                            Title
                        </td>
                        <td className="font-bold">
                            Quantity
                        </td>
                        <td className="font-bold text-center">
                            Price
                        </td>                        
                        <td className="font-bold text-right">
                            Amount
                        </td>
                        <td></td>
                    </tr>                                                
                </thead>
                <tbody>
                {allTransactions.map((transaction) => (
                    <tr className="border-b border-gray-300 even:bg-gray-200 py-2" key={transaction.id}>
                        <td className="px-2 py-2">
                            {transaction.title}
                        </td>
                        <td>
                            {formatQuantity(transaction.quantity,4)} 
                        </td>
                        <td className="text-center">
                            {formatPrice(transaction.price)}
                        </td>
                        <td className="text-right">
                            {formatPrice(transaction.quantity * transaction.price)}
                        </td>
                        <td className="text-right pr-2">
                            <a style={{float:'right'}} href={`/list-transactions/${transaction.id}`}>
                                <Image src="/edit.svg" alt="Edit" style={{ filter: 'invert(5%) sepia(100%) saturate(10000%) hue-rotate(200deg)' }} width={20} height={20}/>
                            </a>
                        </td>                        
                    </tr>
                ))}
                <tr className="h-2"><td colSpan={4}></td></tr>
                <tr className="font-bold">
                    <td></td>
                    <td></td>
                    <td className="text-right">Total:</td>
                    <td className="text-right">{totalAmountString}</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </main>
    );

}

export default ListTransactions;
