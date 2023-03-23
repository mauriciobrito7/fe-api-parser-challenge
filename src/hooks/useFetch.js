import {useEffect, useState} from 'react';

export const useFetch = (apiUrl = '') => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsFetching(true);
    fetch(apiUrl)
      .then(response => response.json())
      .then(setData)
      .catch(error => {
        setError(error);
        console.error(error);
      }).finally(() => setIsFetching(false));
  }, [apiUrl]);
  
  return {
    data,
    isFetching,
    error,
    setError
  };
};
