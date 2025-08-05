import { useState } from 'react';
import Analytics from './analytics';

function AnalyticsWrapper() {
  const [key, setKey] = useState(0);

  const resetComponent = () => {
    setKey((prevKey) => prevKey + 1); 
  };

  return <Analytics key={key} onReset={resetComponent} />;
}

export default AnalyticsWrapper; 
