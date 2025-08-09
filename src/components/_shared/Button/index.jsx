export default function Button({
  startIcon,
  endIcon,
  onClick,
  text,
  className,
  children,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-4 rounded flex justify-center items-center gap-2 bg-primary  ${className}`}
      {...props}
    >
      {startIcon && startIcon}
      {text}
      {children}
      {endIcon && endIcon}
    </button>
  );
}
