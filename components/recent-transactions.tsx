import { formatPrice } from "../app/utils/utils.js";
import { getTransactions } from "../lib/transactions-mariadb";

type TransactionType = {
    type: number;
};

type Transaction = {
    id: number;
    title: string;
    date: string;
    quantity: number;
    price: number;
};

export default async function RecentTransactions({ type }: TransactionType) {
    const transactions: Transaction[] = await getTransactions(
        "",
        "",
        0,
        type,
        7,
        " DESC "
    );

    const isIncome = type === 1;
    const amountColor = isIncome ? "text-[#346538]" : "text-[#9F2F2D]";

    if (transactions.length === 0) {
        return (
            <p className="px-5 py-8 text-center text-sm text-[#787774]">
                No recent transactions
            </p>
        );
    }

    return (
        <ul className="divide-y divide-[#EAEAEA]">
            {transactions.map((transaction) => (
                <li
                    key={transaction.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-[#FBFBFA]"
                >
                    <div className="min-w-0">
                        <time className="mt-0.5 block text-xs leading-5 text-[#787774]">
                            {transaction.date}
                        </time>
                        <p className="truncate text-sm font-medium leading-5 text-[#2F3437]">
                            {transaction.title}
                        </p>
                    </div>
                    <span
                        className={
                            "text-right text-sm font-semibold tabular-nums " +
                            amountColor
                        }
                    >
                        {formatPrice(transaction.quantity * transaction.price)}
                    </span>
                </li>
            ))}
        </ul>
    );
}
