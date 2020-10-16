import { useEffect, useState } from "react";

function useCurrentYear() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    const today = new Date();
    setYear(today.getFullYear());
  }, []);

  return year;
}

export default useCurrentYear;
