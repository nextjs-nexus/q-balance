import { createCategory } from '../../../actions/transactions';
import CategoryForm from '../../../components/category-form';

export default function NewCategoryPage() {

  return (
    <main className='bg-balance-surface'>
      <CategoryForm action={createCategory} />
    </main>
  );
}
