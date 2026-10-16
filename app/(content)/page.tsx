import Link from "next/link";

import ChartByPeriod from "../../components/chart-by-period";
import { getByDays } from "../../lib/transactions-mariadb";
import RecentTransactions from "../../components/recent-transactions";

type ArrayOfObjectsTransactions = {
  day: string;
  income: number;
  expense: number;
}[];


const MainPage = async ( {searchParams}: { searchParams: Promise<{date_from: string, date_to: string, period: string}>} ) => {

    let {date_from, date_to, period} = await searchParams;

	let days_number = 0;

	if (!period) {
		days_number = 7;
		period = 'week';
	}else if(period === 'week') {
		days_number = 7;
	}else if(period === 'month') {
		days_number = 30;
	}else if(period === '6months') {
		days_number = 180;				
	}else{
		days_number = 7;
		period = 'week';
	}

    if ( !date_from ) {
        let dateObj = new Date();
        //dateObj.setDate(days_number * -1);
		dateObj.setDate(dateObj.getDate()-days_number);
        date_from = dateObj.toJSON().slice(0, 10);
    }

    if ( !date_to ) {
        // get only date:
        date_to = new Date().toJSON().slice(0, 10);      
    }  	

	const allTransactions: ArrayOfObjectsTransactions = await getByDays(date_from, date_to);

	return(
		<div className="grid gap-4 p-3 sm:p-5 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] lg:p-6">
			<section className="min-w-0">
				<div className="rounded-md border border-balance-border bg-balance-surface p-3 sm:p-4">
					<div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h1>
							<span className="font-extrabold text-balance-income">
								Income
							</span>
							<span> and </span>
							<span className="font-extrabold text-balance-expense">
								Expense
							</span>
						</h1>
						<div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
						<div>
							<Link href="/?period=week" className={`${
  								period === "week"
								? "font-bold"
								: "font-normal"
								}`}
							>
								Week
							</Link>
						</div>
						<div>
							<Link href="/?period=month" className={`${
  								period === "month"
								? "font-bold"
								: "font-normal"
								}`}
							>
								Month
							</Link>
						</div>
						<div>
							<Link href="/?period=6months" className={`${
  								period === "6months"
								? "font-bold"
								: "font-normal"
								}`}
							>
								Six Months
							</Link>
						</div>
					</div>
					</div>
					<ChartByPeriod all_transactions={allTransactions}/>
				</div>
			</section>
			<aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
				<section
					id="income"
					className="overflow-hidden rounded-lg border border-balance-border bg-balance-surface"
				>
					<header className="flex items-center justify-between border-b border-balance-border px-5 py-4">
						<div>
							<p className="text-xs font-medium uppercase tracking-[0.08em] text-balance-muted">
								Latest activity
							</p>
							<h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-balance-ink">
								Recent Income
							</h2>
						</div>
						<span className="rounded-full bg-balance-income-soft px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-balance-income">
							Received
						</span>
					</header>
					<RecentTransactions type={1} />
				</section>

				<section
					id="expense"
					className="overflow-hidden rounded-lg border border-balance-border bg-balance-surface"
				>
					<header className="flex items-center justify-between border-b border-balance-border px-5 py-4">
						<div>
							<p className="text-xs font-medium uppercase tracking-[0.08em] text-balance-muted">
								Latest activity
							</p>
							<h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-balance-ink">
								Recent Expenses
							</h2>
						</div>
						<span className="rounded-full bg-balance-expense-soft px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-balance-expense">
							Spent
						</span>
					</header>
					<RecentTransactions type={2} />
				</section>
			</aside>
		</div>
	);
}

export default MainPage;
