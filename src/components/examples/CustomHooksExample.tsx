import React, { useState, useEffect } from 'react';
import CodeBlock from '../CodeBlock';
import { Wifi, Mouse, Timer, Database } from 'lucide-react';

// Custom Hook: useCounter
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};

// Custom Hook: useLocalStorage
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};

// Custom Hook: useFetch
const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};

// Custom Hook: useMousePosition
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};

// Custom Hook: useTimer
const useTimer = (initialSeconds = 0) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { seconds, isRunning, start, pause, reset, formatTime };
};

const CustomHooksExample: React.FC = () => {
  // Using custom hooks
  const counter = useCounter(0);
  const [name, setName] = useLocalStorage('user-name', '');
  const mousePosition = useMousePosition();
  const timer = useTimer(0);
  const { data: users, loading, error, refetch } = useFetch<any[]>('https://jsonplaceholder.typicode.com/users?_limit=3');

  const useCounterCode = `const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};

// Usage
const { count, increment, decrement, reset } = useCounter(0);`;

  const useLocalStorageCode = `const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// Usage
const [name, setName] = useLocalStorage('user-name', '');`;

  const useFetchCode = `const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};

// Usage
const { data, loading, error, refetch } = useFetch('/api/users');`;

  const useTimerCode = `const useTimer = (initialSeconds = 0) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  };

  return { seconds, isRunning, start, pause, reset };
};`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Hooks</h2>
        <p className="text-lg text-gray-600 mb-6">
          Custom hooks are JavaScript functions that start with "use" and can call other hooks. They let you extract component logic into reusable functions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Counter Hook */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Database size={20} />
            useCounter Hook
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-blue-600">{counter.count}</div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={counter.decrement}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  -
                </button>
                <button
                  onClick={counter.reset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={counter.increment}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <CodeBlock code={useCounterCode} title="useCounter Implementation" />
        </div>

        {/* LocalStorage Hook */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Database size={20} />
            useLocalStorage Hook
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (saved to localStorage)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  Stored value: <strong>{name || 'None'}</strong>
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  This value persists across page reloads!
                </p>
              </div>
            </div>
          </div>
          <CodeBlock code={useLocalStorageCode} title="useLocalStorage Implementation" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Mouse Position Hook */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Mouse size={20} />
            useMousePosition Hook
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-purple-600">
                X: {mousePosition.x}, Y: {mousePosition.y}
              </div>
              <p className="text-sm text-gray-600">Move your mouse to see coordinates</p>
            </div>
          </div>
        </div>

        {/* Timer Hook */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Timer size={20} />
            useTimer Hook
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center space-y-4">
              <div className="text-3xl font-mono font-bold text-green-600">
                {timer.formatTime(timer.seconds)}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={timer.start}
                  disabled={timer.isRunning}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={timer.pause}
                  disabled={!timer.isRunning}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                >
                  Pause
                </button>
                <button
                  onClick={timer.reset}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <CodeBlock code={useTimerCode} title="useTimer Implementation" />
        </div>
      </div>

      {/* Fetch Hook */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Wifi size={20} />
          useFetch Hook
        </h3>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Wifi size={16} />
              {loading ? 'Loading...' : 'Fetch Users'}
            </button>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error: {error}</p>
              </div>
            )}
            
            {users && users.length > 0 && (
              <div className="space-y-2">
                {users.map(user => (
                  <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <CodeBlock code={useFetchCode} title="useFetch Implementation" />
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-green-900 mb-2">Custom Hook Benefits</h4>
        <ul className="space-y-2 text-green-800">
          <li>• Extract and reuse stateful logic between components</li>
          <li>• Keep components clean and focused on rendering</li>
          <li>• Easy to test logic in isolation</li>
          <li>• Share logic between different components</li>
          <li>• Follow the single responsibility principle</li>
          <li>• Can use other hooks inside custom hooks</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomHooksExample;