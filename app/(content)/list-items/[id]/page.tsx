import { notFound } from 'next/navigation';

import ButtonBack from '../../../../components/button-back';
import CategoriesGrid from '../../../../components/categories-grid';

import { getItem } from '../../../../lib/transactions-mariadb';
import { editItem } from '../../../../actions/transactions';


//export default async function EditCategoryPage({params}) {
type ArrayOfObjects = {
  id: number;
  title: string;
  units: string;
  description: string;
  categoryid: number;
}[];

const EditItemPage = async ( {params}: { params: Promise<{id:string}>} ) => {

  const { id } = await params;

  const result: ArrayOfObjects = await getItem(id);

  if (result.length === 0) {
    notFound();
  }

  let obj = result[0];

  return (
    <main className='bg-white'>
        <form action={editItem}>
            <div className='form-control'>
              <h1 className="font-bold mb-2">Edit Item</h1>
                {result.map((item) => (
                    <div className="form-control" key={item.id}>
                      <input type="hidden" name="id" id="id" defaultValue={item.id} />
                      <label className="mt-2" htmlFor="title">Title</label>
                      <input type="text" name="title" id="title" defaultValue={item.title} />
                      <label className="mt-2" htmlFor="units">Units</label>
                      <input type="text" name="units" id="units" defaultValue={item.units} />  
                      <label className="mt-2" htmlFor="description">Description</label>
                      <textarea id="description" name="description" rows={5} defaultValue={item.description} />
                    </div>
                ))}
            </div>
            <div className="form-control">
              <label className="mt-2" htmlFor="categories">Select Category:</label>
            </div>
            <CategoriesGrid checkedId={obj.categoryid} />
                
            <div className='py-2 px-2 flex flex-row justify-between w-full'>
              <div className='form-actions'>
                  <ButtonBack />
              </div>
              <div className='form-actions'>
                <button id="delete" name="delete" value="1">Delete</button>
                <button className="px-3" id="save" name="save" value="1">Save</button>
              </div>
            </div>
        </form>
    </main>
  );
};

export default EditItemPage;
