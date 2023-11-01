interface ButtonProps {
  className: string;
  onclick: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ className, onclick, text }) => {
  return (
    <>
      <button
        className={className}
        onClick={onclick}>
        {text}
      </button>
    </>
  );
};

export default Button;
