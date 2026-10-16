import { getCategories } from '../lib/transactions-mariadb';

type ArrayOfObjects = {
  id: number;
  title: string;
}[];

type CheckedIdType = {
  checkedId: number;
}

type ConditionalWrapperType = {
  checkedId: number;
  categoryId: number;
}

const ConditionalWrapper = ({ checkedId, categoryId }: ConditionalWrapperType) => {
    if ( checkedId === categoryId ) {
      return (
        <input className="mr-1" value={categoryId} type="radio" defaultChecked name="categoryId" id="categoryId" />
      );
    }else{
      return (
        <input className="mr-1" value={categoryId} type="radio" name="categoryId" id="categoryId" />
      );
    }
}

export default async function CategoriesGrid({checkedId}: CheckedIdType) {

  const categories: ArrayOfObjects = await getCategories();

  return (
    <div  id="categories">
      {categories.map((category) => (
        <div key={category.id}><ConditionalWrapper checkedId={checkedId} categoryId={category.id} />{category.title}</div>
      ))}
    </div>
  );
}
