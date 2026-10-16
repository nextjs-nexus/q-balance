import Image from "next/image.js";

import { getByCategories, getCategories } from "../../../lib/transactions-mariadb";
import { formatPrice, formatQuantity } from "../../utils/utils.js";
import ExpensesFilter from "../../../components/transactions-filter";

type ArrayOfObjects = {
  id: number;
  title: string;
}[];

type ArrayOfObjectsExpenses = {
  id: number;
  title: string;
  income: number;
  expense: number;
}[];

const ListByCategories = async ( {searchParams}: { searchParams: Promise<{date_from: string, date_to: string, category_id:string}>} ) => {

    const {date_from, date_to, category_id} = await searchParams;

    const allCategories: ArrayOfObjects = await getCategories();

    const allTransactions: ArrayOfObjectsExpenses = await getByCategories( date_from, date_to, category_id );

    let totalAmountIncome: number = 0;
    let totalAmountExpense: number = 0;

    allTransactions.map((oneTransaction) => {
        totalAmountIncome = totalAmountIncome + oneTransaction.income;
        totalAmountExpense = totalAmountExpense + oneTransaction.expense;
    });

    let totalAmountIncomeString: string = formatPrice(totalAmountIncome);
    let totalAmountExpenseString: string = formatPrice(totalAmountExpense);

    let balance: number = totalAmountIncome - totalAmountExpense;
    let balanceString = formatPrice(balance);

    return (
        <main className='bg-balance-surface'>
            <div>
                <ExpensesFilter date_from={date_from} date_to={date_to} all_categories={allCategories} list_type="list-by-categories"/>
            </div>
            <div className="h-3"></div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-balance-border  bg-balance-accent py-2">
                        <td className="font-bold py-2 px-2">
                            Category
                        </td>                      
                        <td className="font-bold text-right w-[15%]">
                            Income
                        </td>
                        <td className="font-bold text-right w-[15%]">
                            Expense
                        </td>                        
                    </tr>                                                
                </thead>
                <tbody>
                {allTransactions.map((oneTransaction) => (
                    <tr className="border-b border-balance-border even:bg-balance-soft py-2" key={oneTransaction.id}>
                        <td className="px-2 py-2">
                            {oneTransaction.title}
                        </td>                        
                        <td className="text-right">
                            {formatPrice(oneTransaction.income)}
                        </td>                        
                        <td className="text-right">
                            {formatPrice(oneTransaction.expense)}
                        </td>                                                
                    </tr>
                ))}
                <tr className="h-2"><td colSpan={4}></td></tr>
                <tr className="font-bold">
                    <td className="text-right">Totals:</td>
                    <td className="text-right">{totalAmountIncomeString}</td>
                    <td className="text-right">{totalAmountExpenseString}</td>
                </tr>
                <tr className="font-bold">
                    <td className="text-right">Balance:</td>
                    <td colSpan={2} className="text-right">{balanceString}</td>
                </tr>
                </tbody>
            </table>
        </main>
    );

}

export default ListByCategories;
