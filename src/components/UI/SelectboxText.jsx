const SelectboxText = ({ text, secondaryText, checked, OptionValue, onChange }) => {
    const OptionData = OptionValue.map((data, index) => {
        const isSelected = checked === data.value;
        return (
            <option value={data.value} key={index} disabled={isSelected}>
                {data.label}
            </option>
        );
    });

    return (
        <>
            <div className="form-control">
                <label className="label gap-2">
                    <div>
                        <span className="label-text font-bold">{text}</span>
                        {secondaryText &&
                            <span className="label-text font-light"><br />{secondaryText}</span>
                        }
                    </div>
                    <select className="select select-bordered w-min max-w-xs" onChange={onChange} value={checked}>
                        {OptionData}
                    </select>
                </label>
            </div>
        </>
    )
}

export default SelectboxText