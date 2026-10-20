'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { calculateDiscountedPrice } from '../lib/transaction-discount';

import { storeCategory } from '../lib/transactions-mariadb';
import { storeEditCategory } from '../lib/transactions-mariadb';
import { deleteCategory } from '../lib/transactions-mariadb';

import { storeItem } from '../lib/transactions-mariadb';
import { storeEditItem } from '../lib/transactions-mariadb';
import { deleteItem } from '../lib/transactions-mariadb';

import { storeTransaction } from '../lib/transactions-mariadb';
import { storeEditTransaction } from '../lib/transactions-mariadb';
import { deleteTransaction } from '../lib/transactions-mariadb';


/***************************************************/
export async function createCategory(prevState, formData: FormData) {

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  let errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required.');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Description is required.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  await storeCategory({
    title,
    description
  });

  revalidatePath('/', 'layout');
  redirect('/');

}


/***************************************************/
export async function editCategory(formData: FormData) {

  const id = formData.get('id');
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const button_delete = formData.get('delete');
  const button_save = formData.get('save');

  if (button_save) {
    await storeEditCategory(id, {
      title,
      description
    });
  }else if (button_delete) {
    await deleteCategory(id);
  }

  revalidatePath('/', 'layout');
  redirect('/list-categories');

}


/***************************************************/
export async function createItem(prevState, formData: FormData) {

  console.log('fd');
  console.log(formData);

  const title = formData.get('title') as string;
  const units = formData.get('units') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;

  let errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required.');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Description is required.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  await storeItem({
    title,
    description,
    units,
    categoryId
  });

  revalidatePath('/', 'layout');
  redirect('/list-items');

}


/***************************************************/
export async function editItem(formData: FormData) {

  const id = formData.get('id');
  const title = formData.get('title') as string;
  const units = formData.get('units') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const button_delete = formData.get('delete');
  const button_save = formData.get('save');

  if (button_save) {
    await storeEditItem(id, {
      title,
      units,
      description,
      categoryId
    });
  }else if (button_delete) {
    await deleteItem(id);
  }

  revalidatePath('/', 'layout');
  redirect('/list-items');

}



/***************************************************/
export async function createTransaction(prevState, formData: FormData) {

  const itemId = formData.get('itemId') as string;
  const quantity = formData.get('quantity') as string;
  const price = String(formData.get('price') || '').trim().replace(',', '.');
  const type = formData.get('type') as string;
  const comments = formData.get('comments') as string;
  const discount = String(formData.get('discount') || '');
  const discounted = calculateDiscountedPrice(type, quantity || '', price || '', discount);

  let errors: string[] = [];

  if (!itemId || itemId.trim().length === 0) {
    errors.push('itemId is required.');
  }

  if (!quantity || quantity.trim().length === 0) {
    errors.push('Quantity is required.');
  }

  if (!price || price.trim().length === 0) {
    errors.push('Price is required.');
  }

  if (discounted && 'error' in discounted) {
    errors.push(discounted.error);
  }

  if (errors.length > 0) {
    return { errors };
  }

  await storeTransaction({
    itemId, 
    quantity, 
    price: discounted && 'price' in discounted ? String(discounted.price.toFixed(2)) : price, 
    type,
    comments
  });

  revalidatePath('/', 'layout');
  redirect('/new-transaction?type='+type);

}


/***************************************************/
export async function editTransaction(formData: FormData) {

  const eid = formData.get('eid');
  const itemId = formData.get('itemId') as string;
  const quantity = formData.get('quantity') as string;
  const price = String(formData.get('price') || '').trim().replace(',', '.');
  const comments = formData.get('comments') as string;
  const button_delete = formData.get('delete');
  const button_save = formData.get('save');

  let errors: string[] = [];

  if (!eid) {
    errors.push('Expense id is required.');
  }  

  if (!itemId || itemId.trim().length === 0) {
    errors.push('itemId is required.');
  }

  if (!quantity || quantity.trim().length === 0) {
    errors.push('Quantity is required.');
  }

  if (!price || price.trim().length === 0) {
    errors.push('Price is required.');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  if (button_save) {
    await storeEditTransaction(eid,{
      itemId, 
      quantity, 
      price, 
      comments
    });
  }else if (button_delete) {
    await deleteTransaction(eid);
  }

  revalidatePath('/', 'layout');
  redirect('/list-transactions');

}
