const Button = ({ className, onclick, text }) => {
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
