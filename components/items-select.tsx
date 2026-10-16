import { getItems } from '../lib/transactions-mariadb';

type ArrayOfObjects = {
  id: number;
  title: string;
}[];

type SelectedIdType = {
  selectedId: number;
}

export default async function ItemsSelect({selectedId}: SelectedIdType) {

  const items: ArrayOfObjects = await getItems();

  return (
    <div className='form-control'>
    <select name="itemId" id="itemId" defaultValue={selectedId}>
      <option value={0}>--Select Item--</option>  
      {items.map((item) => (
        <option key={item.id} value={item.id}>{item.title}</option>
      ))}
    </select>
    </div>
  );
}
