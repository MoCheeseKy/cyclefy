export default function Wrapper({ children, className, id }) {
  return (
    <>
      <div
        id={id || ''}
        className={`px-4 md:px-0 w-full md:w-[85%] lg:w-full max-w-[1170px] ${className} min-h-fit`}
      >
        {children}
      </div>
    </>
  );
}
