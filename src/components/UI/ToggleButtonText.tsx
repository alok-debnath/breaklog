interface ToggleButtonTextProps {
  text: string;
  secondaryText?: string; // This prop is optional
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean; // This prop is optional
}
const ToggleButtonText: React.FC<ToggleButtonTextProps> = ({
  text,
  secondaryText,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <>
      <div className='form-control'>
        <label className='label cursor-pointer gap-2'>
          <div>
            <span className='label-text font-bold'>{text}</span>
            {secondaryText && (
              <span className='label-text font-light'>
                <br />
                {secondaryText}
              </span>
            )}
          </div>
          <input
            type='checkbox'
            className={`toggle`}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
        </label>
      </div>
    </>
  );
};

export default ToggleButtonText;
