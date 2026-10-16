import { createCategory } from '../../../actions/transactions';
import CategoryForm from '../../../components/category-form';

export default function NewCategoryPage() {

  return (
    <main className='bg-white'>
      <CategoryForm action={createCategory} />
    </main>
  );
}
