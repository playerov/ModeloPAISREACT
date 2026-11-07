import { useEffect, useState } from "react";

// Devuelve `value` recién después de que dejó de cambiar durante `delay` ms.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // si cambia antes, cancela el timer anterior
  }, [value, delay]);

  return debounced;
}
