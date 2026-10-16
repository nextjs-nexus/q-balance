"use client";

import Link from "next/link";
import { useState } from "react";

type AllCategoriesType = {
  id: number;
  title: string;
}[];

type TransactionsPropsType = {
  date_from: string;
  date_to: string;
  all_categories: AllCategoriesType;
  list_type: string;
};

export default function TransactionsFilter({date_from, date_to, all_categories, list_type}: TransactionsPropsType) {
  const defaultFrom = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toJSON().slice(0, 10);
  };

  const [dateFrom, setDateFrom] = useState(date_from || defaultFrom());
  const [dateTo, setDateTo] = useState(date_to || new Date().toJSON().slice(0, 10));
  const [categoryId, setCategoryId] = useState(0);
  const [type, setType] = useState(2);
  const listPath = list_type || "list-transactions";

  return (
    <div className="rounded-md bg-gray-100 p-3 sm:p-4">
      <form>
        <div className="form-control grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto_auto] xl:items-end">
          <label className="mb-0">
            From
            <input type="date" name="ffdate_from" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          </label>
          <label className="mb-0">
            To
            <input type="date" name="ffdate_to" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </label>
          <label className="mb-0">
            Category
            <select name="categoryId" id="categoryId" onChange={(event) => setCategoryId(Number(event.target.value))}>
              <option value="0">All</option>
              {all_categories.map((category) => (
                <option key={category.id} value={category.id}>{category.title}</option>
              ))}
            </select>
          </label>

          {listPath === "list-transactions" ? (
            <fieldset className="flex min-h-10 items-center gap-3 sm:col-span-2 xl:col-span-1">
              <legend className="sr-only">Transaction type</legend>
              <span className="text-sm font-semibold">Type:</span>
              <label className="flex items-center gap-1 font-normal">
                <input className="!mb-0 !w-auto" type="radio" name="type" value={1} onChange={(event) => setType(Number(event.target.value))} />
                Income
              </label>
              <label className="flex items-center gap-1 font-normal">
                <input className="!mb-0 !w-auto" type="radio" name="type" defaultChecked value={2} onChange={(event) => setType(Number(event.target.value))} />
                Expense
              </label>
            </fieldset>
          ) : null}

          <span className="filter-form-actions sm:col-span-2 xl:col-span-1 pb-3">
            <Link className="flex min-h-10 items-center justify-center" href={`${listPath}?date_from=${dateFrom}&date_to=${dateTo}&category_id=${categoryId}&type=${type}`}>
              Show
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
