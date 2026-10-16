import { createTransaction } from '../../../actions/transactions';
import TransactionForm from '../../../components/transaction-form';
import ItemsSelect from '../../../components/items-select';

export default function NewTransactionPage() {
  return (
    <main className='bg-balance-surface'>
      <TransactionForm action={createTransaction}>
        <ItemsSelect selectedId={0}/>
      </TransactionForm>
    </main>
  );
}
