
const TransactionTypeRadio = ({ type, onChange }: {
    type: string;
    onChange: (type: string) => void;
}) => {

    return (
        <fieldset className="mb-4 flex flex-wrap items-center gap-4">
            <legend className="mb-2 text-sm font-semibold">Type:</legend>
            <label className="!mb-0 !flex !w-auto items-center gap-2 font-normal">
                <input
                    className="!mb-0 !min-h-0 !w-auto"
                    type="radio"
                    name="type"
                    value="1"
                    checked={type === '1'}
                    onChange={() => onChange('1')}
                />
                Income
            </label>
            <label className="!mb-0 !flex !w-auto items-center gap-2 font-normal">
                <input
                    className="!mb-0 !min-h-0 !w-auto"
                    type="radio"
                    name="type"
                    value="2"
                    checked={type === '2'}
                    onChange={() => onChange('2')}
                />
                Expense
            </label>
        </fieldset>
    );

}

export default TransactionTypeRadio;
