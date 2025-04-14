const TypingIndicator = ({ name = "Alguien" }) => {
  return (
    <div className="flex items-center gap-2 mt-2 px-2 py-1">
      <span className="text-sm italic ">{name} está escribiendo</span>
      <span className="flex gap-1 text-lg text-success font-semibold">
        <span className="animate-bounce [animation-delay:-0.3s]">.</span>
        <span className="animate-bounce [animation-delay:-0.15s]">.</span>
        <span className="animate-bounce">.</span>
      </span>
    </div>
  );
};

export default TypingIndicator;
