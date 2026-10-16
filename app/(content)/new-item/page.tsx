
import { createItem } from '../../../actions/transactions';
import ItemForm from '../../../components/item-form';
import CategoriesGrid from '../../../components/categories-grid';

export default function NewItemPage() {
  return (
    <main className='bg-balance-surface'>
      <ItemForm action={createItem}>
        <CategoriesGrid checkedId={null}/>
      </ItemForm>
    </main>
  );
}
