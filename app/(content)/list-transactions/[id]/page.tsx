import { notFound } from 'next/navigation';

import ButtonBack from '../../../../components/button-back';
import { getTransaction } from '../../../../lib/transactions-mariadb';
import { editTransaction } from '../../../../actions/transactions';
import ItemsSelect from '../../../../components/items-select';

type ArrayOfObjects = {
  id: number;
  itemid: number;
  quantity: number;
  price: number;
  comments: string;
}[];

const EditExpensePage = async ( {params}: { params: Promise<{id:string}>} ) => {

  const { id } = await params;

  const result: ArrayOfObjects = await getTransaction(id);

  if (result.length === 0) {
    notFound();
  }

  let obj = result[0];

  return (
    <main className='bg-white'>
        <form action={editTransaction}>
            <div>
              <h1 className="font-bold mb-2">Edit Transaction</h1>    
                <div className='form-control'>
                  <label className="mt-2">Select Item:</label>
                  <ItemsSelect selectedId={obj.itemid} />
                </div>
                <div className="form-control">
                  <input type="hidden" name="eid" id="eid" defaultValue={obj.id} />
                  <label className="mt-2" htmlFor="quantity">Quantity</label>
                  <input type="text" name="quantity" id="quantity" defaultValue={obj.quantity} />
                  <label className="mt-2" htmlFor="price">Price</label>
                  <input type="text" name="price" id="price" defaultValue={obj.price} />
                  <label className="mt-2" htmlFor="comments">Comments</label>
                  <textarea id="comments" name="comments" rows={5} defaultValue={obj.comments} />
                </div>
                <div className='py-2 px-2 flex flex-row justify-between w-full'>
                  <div className='form-actions'>
                    <ButtonBack />
                  </div>
                  <div className='form-actions'>
                    <button id="delete" name="delete" value="1">Delete</button>
                    <button className="px-3" id="save" name="save" value="1">Save</button>
                  </div>
                </div>
            </div>
        </form>
    </main>
  );
};

export default EditExpensePage;
