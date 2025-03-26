
const Input = ({ icon: Icon, name, type, placeholder, register, error }) => {
    return (
      <>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center  pl-3 pointer-events-none">
            <Icon className="size-5  z-100 " />
          </div>
          <input
            type={type}
            placeholder={placeholder}
            {...register(name)}
            className="pl-10 input input-bordered w-full"
          />
        </div>
        {error && <p className="text-red-400">{error}</p>}
      </>
    );
  };
  
  export default Input;