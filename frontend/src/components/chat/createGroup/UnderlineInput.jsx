function UnderlineInput({ name, setName }) {
  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-transparent border-b border-info  outline-none pl-1"
      />
    </div>
  );
}

export default UnderlineInput;
