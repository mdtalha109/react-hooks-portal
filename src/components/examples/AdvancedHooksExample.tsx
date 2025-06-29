import React, { useLayoutEffect, useDebugValue, useId, useDeferredValue, useTransition, useSyncExternalStore, useInsertionEffect, useImperativeHandle, forwardRef, useState, useRef } from 'react';
import CodeBlock from '../CodeBlock';
import { Zap, Bug, Hash, Clock, ArrowRight, Database, Palette, Link } from 'lucide-react';

// useImperativeHandle example
interface CustomInputHandle {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
}

const CustomInput = forwardRef<CustomInputHandle, { placeholder?: string }>((props, ref) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      setValue('');
      inputRef.current?.focus();
    },
    getValue: () => value
  }));

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={props.placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
});

// Custom hook with useDebugValue
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  // This will show in React DevTools
  useDebugValue(count > 10 ? 'High' : 'Low');
  
  return [count, setCount] as const;
}

// External store for useSyncExternalStore
const createStore = () => {
  let state = { count: 0 };
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (newState: typeof state) => {
      state = newState;
      listeners.forEach(listener => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

const externalStore = createStore();

const AdvancedHooksExample: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [layoutCount, setLayoutCount] = useState(0);
  const [insertionStyles, setInsertionStyles] = useState<string[]>([]);
  
  // useId for unique identifiers
  const formId = useId();
  const inputId = useId();
  const labelId = useId();
  
  // useImperativeHandle ref
  const customInputRef = useRef<CustomInputHandle>(null);
  
  // useSyncExternalStore
  const externalState = useSyncExternalStore(
    externalStore.subscribe,
    externalStore.getState
  );
  
  // Custom hook with debug value
  const [debugCount, setDebugCount] = useCounter(0);

  // useLayoutEffect example
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (measureRef.current) {
      const { width, height } = measureRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [layoutCount]);

  // useInsertionEffect for CSS-in-JS
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dynamic-style-${insertionStyles.length} {
        background: linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)});
        padding: 8px;
        border-radius: 4px;
        margin: 4px 0;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [insertionStyles.length]);

  // Simulate expensive search
  const searchResults = React.useMemo(() => {
    if (!deferredSearchTerm) return [];
    
    // Simulate expensive operation
    const results = [];
    for (let i = 0; i < 1000; i++) {
      if (`Item ${i}`.toLowerCase().includes(deferredSearchTerm.toLowerCase())) {
        results.push(`Item ${i}`);
      }
    }
    return results.slice(0, 10);
  }, [deferredSearchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    startTransition(() => {
      // This update is marked as non-urgent
      setSearchTerm(value);
    });
  };

  const useLayoutEffectCode = `// useLayoutEffect runs synchronously after DOM mutations
function Component() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  return <div ref={ref}>Measured element</div>;
}`;

  const useDebugValueCode = `// useDebugValue shows custom labels in React DevTools
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  // Shows "High" or "Low" in DevTools
  useDebugValue(count > 10 ? 'High' : 'Low');
  
  return [count, setCount];
}`;

  const useIdCode = `// useId generates unique IDs for accessibility
function Form() {
  const formId = useId();
  const inputId = useId();
  const labelId = useId();

  return (
    <form id={formId}>
      <label id={labelId} htmlFor={inputId}>
        Name:
      </label>
      <input
        id={inputId}
        aria-labelledby={labelId}
        type="text"
      />
    </form>
  );
}`;

  const useTransitionCode = `// useTransition marks updates as non-urgent
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value) => {
    setSearchTerm(value); // Urgent update
    
    startTransition(() => {
      // Non-urgent update - won't block UI
      performExpensiveSearch(value);
    });
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <div>Searching...</div>}
    </div>
  );
}`;

  const useDeferredValueCode = `// useDeferredValue defers updates to improve performance
function SearchResults({ searchTerm }) {
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  // Expensive calculation uses deferred value
  const results = useMemo(() => {
    return performExpensiveSearch(deferredSearchTerm);
  }, [deferredSearchTerm]);

  return (
    <div>
      {searchTerm !== deferredSearchTerm && <div>Loading...</div>}
      {results.map(result => <div key={result}>{result}</div>)}
    </div>
  );
}`;

  const useSyncExternalStoreCode = `// useSyncExternalStore subscribes to external data sources
const store = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

function Component() {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getState
  );

  return <div>External state: {state.count}</div>;
}`;

  const useImperativeHandleCode = `// useImperativeHandle customizes ref exposure
const CustomInput = forwardRef((props, ref) => {
  const [value, setValue] = useState('');
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => setValue(''),
    getValue: () => value
  }));

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
});`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced React Hooks</h2>
        <p className="text-lg text-gray-600 mb-6">
          Explore the more advanced React hooks including useLayoutEffect, useDebugValue, useId, useDeferredValue, useTransition, useSyncExternalStore, useInsertionEffect, and useImperativeHandle.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* useLayoutEffect */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Zap size={20} />
            useLayoutEffect
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div
                ref={measureRef}
                className="p-4 bg-blue-100 rounded-lg resize overflow-auto"
                style={{ minHeight: '100px', minWidth: '200px' }}
              >
                <p>Resize me or click the button to remeasure!</p>
                <p className="text-sm text-gray-600 mt-2">
                  Width: {dimensions.width.toFixed(0)}px<br />
                  Height: {dimensions.height.toFixed(0)}px
                </p>
              </div>
              <button
                onClick={() => setLayoutCount(c => c + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Remeasure ({layoutCount})
              </button>
            </div>
          </div>
        </div>

        {/* useId */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Hash size={20} />
            useId
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <form id={formId} className="space-y-4">
              <div>
                <label id={labelId} htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
                  Name (with unique IDs):
                </label>
                <input
                  id={inputId}
                  aria-labelledby={labelId}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Form ID: {formId}</div>
                <div>Input ID: {inputId}</div>
                <div>Label ID: {labelId}</div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* useTransition & useDeferredValue */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={20} />
            useTransition & useDeferredValue
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search (with transitions):
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search items..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {isPending && (
                <div className="text-sm text-blue-600">🔄 Searching...</div>
              )}
              
              <div className="max-h-40 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-2 border-b border-gray-100 text-sm">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* useSyncExternalStore */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Database size={20} />
            useSyncExternalStore
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {externalState.count}
                </div>
                <div className="text-sm text-gray-600">External Store Count</div>
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => externalStore.setState({ count: externalState.count - 1 })}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <button
                  onClick={() => externalStore.setState({ count: 0 })}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Reset
                </button>
                <button
                  onClick={() => externalStore.setState({ count: externalState.count + 1 })}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* useDebugValue */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Bug size={20} />
            useDebugValue
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {debugCount}
                </div>
                <div className="text-sm text-gray-600">
                  Debug Count (check React DevTools)
                </div>
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setDebugCount(debugCount - 1)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Decrement
                </button>
                <button
                  onClick={() => setDebugCount(debugCount + 1)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Increment
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Open React DevTools to see debug value
              </div>
            </div>
          </div>
        </div>

        {/* useImperativeHandle */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Link size={20} />
            useImperativeHandle
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <CustomInput ref={customInputRef} placeholder="Custom input with imperative handle" />
              
              <div className="flex gap-2">
                <button
                  onClick={() => customInputRef.current?.focus()}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Focus
                </button>
                <button
                  onClick={() => customInputRef.current?.clear()}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear
                </button>
                <button
                  onClick={() => alert(`Value: ${customInputRef.current?.getValue()}`)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Get Value
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* useInsertionEffect */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Palette size={20} />
          useInsertionEffect
        </h3>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <button
              onClick={() => setInsertionStyles(prev => [...prev, `style-${prev.length}`])}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Add Dynamic Style
            </button>
            
            <div className="space-y-2">
              {insertionStyles.map((style, index) => (
                <div key={style} className={`dynamic-style-${index}`}>
                  Dynamic style {index + 1} - inserted before DOM mutations
                </div>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              Each style is inserted using useInsertionEffect
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useLayoutEffect</h3>
          <CodeBlock code={useLayoutEffectCode} title="Synchronous DOM Measurements" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useDebugValue</h3>
          <CodeBlock code={useDebugValueCode} title="Custom Hook Debugging" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useId</h3>
          <CodeBlock code={useIdCode} title="Unique ID Generation" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useTransition</h3>
          <CodeBlock code={useTransitionCode} title="Non-urgent Updates" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useDeferredValue</h3>
          <CodeBlock code={useDeferredValueCode} title="Deferred Updates" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useSyncExternalStore</h3>
          <CodeBlock code={useSyncExternalStoreCode} title="External Store Subscription" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useImperativeHandle</h3>
          <CodeBlock code={useImperativeHandleCode} title="Custom Ref Interface" />
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-amber-900 mb-2">Advanced Hooks Summary</h4>
        <div className="grid md:grid-cols-2 gap-6 text-amber-800 text-sm">
          <div>
            <h5 className="font-semibold mb-2">Performance & Optimization:</h5>
            <ul className="space-y-1">
              <li>• <strong>useTransition:</strong> Non-urgent updates</li>
              <li>• <strong>useDeferredValue:</strong> Defer expensive updates</li>
              <li>• <strong>useLayoutEffect:</strong> Synchronous DOM effects</li>
              <li>• <strong>useInsertionEffect:</strong> CSS-in-JS libraries</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Development & Integration:</h5>
            <ul className="space-y-1">
              <li>• <strong>useDebugValue:</strong> DevTools debugging</li>
              <li>• <strong>useId:</strong> Unique ID generation</li>
              <li>• <strong>useSyncExternalStore:</strong> External data sources</li>
              <li>• <strong>useImperativeHandle:</strong> Custom ref APIs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedHooksExample;