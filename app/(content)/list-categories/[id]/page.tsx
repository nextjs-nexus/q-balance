import { notFound } from 'next/navigation';

import { getCategory } from '../../../../lib/transactions-mariadb';
import { editCategory } from '../../../../actions/transactions';
import ButtonBack from '../../../../components/button-back';

type ArrayOfObjects = {
  id: number;
  title: string;
  description: string;
}[];

const EditCategoryPage = async ( {params}: { params: Promise<{id:string}>} ) => {

  const { id } = await params;

  const result: ArrayOfObjects = await getCategory(id);

  if (result.length === 0) {
    notFound();
  }

  return (
    <main className='bg-white'>
        <form action={editCategory}>
            <div>
              <h1 className="form-control py-2 px-2 font-semibold">Edit Category</h1>
                {result.map((category) => (
                    <div className="form-control" key={category.id}>
                      <input type="hidden" name="id" id="id" defaultValue={category.id} />
                      <label className="mt-2" htmlFor="title">Title</label>
                      <input type="text" name="title" id="title" defaultValue={category.title} />
                      <label className="mt-2" htmlFor="description">Description</label>
                      <textarea id="description" name="description" rows={5} defaultValue={category.description} />
                    </div>
                ))}
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

export default EditCategoryPage;
