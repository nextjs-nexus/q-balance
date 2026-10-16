import NavLinkAdv from './nav-link-adv';

export default function MainMenu() {
  return (
    <header className="mt-2 md:mt-4">
      <nav aria-label="Main navigation" className="overflow-x-auto">
        <div className='flex min-w-max gap-1 md:min-w-0 md:flex-col'>
          <p className='text-slate-400 font-normal text-lg'>New Data</p>
          <div>
            <NavLinkAdv href="/new-category" image="/new-category.svg">
              <span className="hidden lg:block">New Category</span>
            </NavLinkAdv>
          </div>
          <div>
            <NavLinkAdv href="/new-item" image="/new-item.svg">
              <span className="hidden lg:block">New Item</span>
            </NavLinkAdv>
          </div>
          <div>
            <NavLinkAdv href="/new-transaction" image="/new-expense.svg">
              <span className="hidden lg:block">New Transaction</span>
            </NavLinkAdv>
          </div>
          <br />
          <p className='text-slate-400 font-normal text-lg'>Lists</p> 
          <div>
            <NavLinkAdv href="/list-categories" image="/list-categories.svg">
              <span className="hidden lg:block">List Categories</span>
            </NavLinkAdv>
          </div>
          <div>
            <NavLinkAdv href="/list-items" image="/list-items.svg">
              <span className="hidden lg:block">List Items</span>
            </NavLinkAdv>
          </div>
          <div>
            <NavLinkAdv href="/list-transactions" image="/list-expenses.svg">
              <span className="hidden lg:block">List Transactions</span>
            </NavLinkAdv>
          </div>
          <div>
            <NavLinkAdv href="/list-by-categories" image="/list-expenses.svg">
              <span className="hidden lg:block">List by Categories</span>
            </NavLinkAdv>
          </div>          
        </div>
      </nav>
    </header>
  );
}
