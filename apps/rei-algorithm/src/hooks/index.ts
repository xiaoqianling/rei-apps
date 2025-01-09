import { useState, useEffect } from "react";

function useFetch(url: string) {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setResult(result);
        setIsLoading(false);
      } catch (error) {
        setResult({
          code: -1,
          message: "TODO error info unknown",
        });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { result, isLoading };
}
