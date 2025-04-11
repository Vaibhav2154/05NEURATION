import React, { useState, useEffect } from 'react';
import QuickLRU from '@alloc/quick-lru';

const lruCache = new QuickLRU({ maxSize: 100 });

const Docs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint) => {
    // Check if the data is already in the cache
    if (lruCache.has(endpoint)) {
      console.log('Fetching from cache...');
      return lruCache.get(endpoint);
    }

    try {
      setLoading(true);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();

      // Store the result in the cache
      lruCache.set(endpoint, result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData('/api/backend-endpoint');
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h1> Document </h1>
     

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <h2>Data from Backend:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

   
    </div>
  );
};

export default Docs;