import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PostSearch() {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [input, setInput] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      // 🔄 Si está vacío, vuelve a la ruta base (sin search)
      navigate(pathname);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(input.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevenir recarga
      if (input.trim()) {
        navigate(`/?search=${encodeURIComponent(input.trim())}`);
      } else {
        // Si se borra el input, eliminar el parámetro search
        navigate(pathname); // redirige a / sin parámetros
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center  pl-3 pointer-events-none">
        <Search className="size-5  z-1 text-info" />
      </div>
      <input
        type="text"
        placeholder="Buscar publicaciones..."
        className="pl-10 input input-bordered w-full"
        value={input}
        onChange={handleChange}
        onKeyDown={handleSearch}
      />
    </div>
  );
}
