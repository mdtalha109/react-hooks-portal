import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Save, X, Plus, BookOpen, Lightbulb, Code, Target } from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';

interface NotesPanelProps {
  hookId: string;
  isOpen: boolean;
  onClose: () => void;
}

const defaultNotes = {
  useState: `# useState Hook - Complete Guide

## What is useState?
useState is a React Hook that lets you add state to functional components. It's the most fundamental hook for managing component state.

## Syntax
\`\`\`javascript
const [state, setState] = useState(initialValue);
\`\`\`

## Key Concepts
• **State Variable**: The current state value
• **Setter Function**: Function to update the state
• **Initial Value**: Can be a value or a function
• **Re-rendering**: Component re-renders when state changes

## Common Patterns
1. **Simple State**: \`const [count, setCount] = useState(0)\`
2. **Object State**: \`const [user, setUser] = useState({ name: '', age: 0 })\`
3. **Array State**: \`const [items, setItems] = useState([])\`
4. **Boolean State**: \`const [isVisible, setIsVisible] = useState(false)\`

## Best Practices
✅ Use multiple useState calls for unrelated state
✅ Use functional updates when new state depends on previous state
✅ Initialize state with functions for expensive computations
❌ Don't mutate state directly
❌ Don't call hooks inside loops or conditions

## Performance Tips
• Use lazy initial state for expensive calculations
• Consider useReducer for complex state logic
• Split state into multiple variables when appropriate

## Common Gotchas
• State updates are asynchronous
• State updates may be batched
• Objects and arrays need to be replaced, not mutated`,

  useEffect: `# useEffect Hook - Complete Guide

## What is useEffect?
useEffect lets you perform side effects in functional components. It combines componentDidMount, componentDidUpdate, and componentWillUnmount.

## Syntax
\`\`\`javascript
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]); // Dependencies array (optional)
\`\`\`

## Three Main Patterns

### 1. No Dependencies - Runs after every render
\`\`\`javascript
useEffect(() => {
  console.log('Runs after every render');
});
\`\`\`

### 2. Empty Dependencies - Runs once on mount
\`\`\`javascript
useEffect(() => {
  console.log('Runs once on mount');
}, []);
\`\`\`

### 3. With Dependencies - Runs when dependencies change
\`\`\`javascript
useEffect(() => {
  console.log('Runs when count changes');
}, [count]);
\`\`\`

## Common Use Cases
• **Data Fetching**: API calls on component mount
• **Subscriptions**: Event listeners, WebSocket connections
• **Timers**: setInterval, setTimeout
• **DOM Manipulation**: Direct DOM updates
• **Cleanup**: Removing event listeners, clearing timers

## Cleanup Function
Always clean up to prevent memory leaks:
\`\`\`javascript
useEffect(() => {
  const timer = setInterval(() => {
    // Timer logic
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);
\`\`\`

## Best Practices
✅ Always include dependencies in the array
✅ Use multiple useEffect hooks for different concerns
✅ Clean up subscriptions and timers
❌ Don't forget the dependency array
❌ Don't put objects/functions in dependencies without memoization

## ESLint Plugin
Use eslint-plugin-react-hooks to catch dependency issues automatically.`,

  useContext: `# useContext Hook - Complete Guide

## What is useContext?
useContext provides a way to pass data through the component tree without having to pass props down manually at every level.

## Syntax
\`\`\`javascript
const value = useContext(MyContext);
\`\`\`

## Complete Example
\`\`\`javascript
// 1. Create Context
const ThemeContext = createContext();

// 2. Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Consumer Component
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button className={theme}>
      Toggle Theme
    </button>
  );
}
\`\`\`

## Key Concepts
• **Context**: Container for shared data
• **Provider**: Component that provides the context value
• **Consumer**: Component that uses the context value
• **Default Value**: Fallback when no Provider is found

## When to Use Context
✅ Theme data (dark/light mode)
✅ User authentication state
✅ Language/locale settings
✅ Shopping cart state
❌ All component state (overuse leads to performance issues)

## Best Practices
✅ Create separate contexts for different concerns
✅ Provide default values
✅ Use custom hooks to wrap useContext
✅ Keep context values stable to avoid unnecessary re-renders

## Performance Considerations
• All consumers re-render when context value changes
• Split contexts to minimize re-renders
• Use React.memo for expensive components
• Consider using multiple contexts instead of one large context

## Custom Hook Pattern
\`\`\`javascript
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
\`\`\``,

  useReducer: `# useReducer Hook - Complete Guide

## What is useReducer?
useReducer is an alternative to useState for managing complex state logic. It's similar to Redux reducers.

## Syntax
\`\`\`javascript
const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`

## Complete Example
\`\`\`javascript
// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error('Unknown action type');
  }
}

// Component
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
\`\`\`

## When to Use useReducer
✅ Complex state logic with multiple sub-values
✅ State transitions depend on previous state
✅ Want to optimize performance with deep updates
✅ State logic is complex and involves multiple actions

## useReducer vs useState
| useReducer | useState |
|------------|----------|
| Complex state logic | Simple state |
| Multiple related state variables | Single state variable |
| State depends on previous state | Independent state updates |
| Predictable state transitions | Simple state changes |

## Advanced Patterns

### Lazy Initialization
\`\`\`javascript
function init(initialCount) {
  return { count: initialCount };
}

const [state, dispatch] = useReducer(reducer, initialCount, init);
\`\`\`

### Action Creators
\`\`\`javascript
const actions = {
  increment: () => ({ type: 'increment' }),
  decrement: () => ({ type: 'decrement' }),
  reset: () => ({ type: 'reset' })
};
\`\`\`

## Best Practices
✅ Keep reducers pure (no side effects)
✅ Use TypeScript for better action type safety
✅ Combine with useContext for global state management
✅ Use action creators for complex actions
❌ Don't mutate state directly in reducers`,

  useCallback: `# useCallback Hook - Complete Guide

## What is useCallback?
useCallback returns a memoized callback function. It's used to optimize performance by preventing unnecessary re-renders.

## Syntax
\`\`\`javascript
const memoizedCallback = useCallback(
  () => {
    // Callback function
  },
  [dependencies]
);
\`\`\`

## Problem it Solves
Without useCallback, functions are recreated on every render, causing child components to re-render unnecessarily.

## Example
\`\`\`javascript
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Without useCallback - recreated every render
  const handleClick = () => {
    console.log('Button clicked');
  };
  
  // With useCallback - memoized
  const memoizedHandleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Empty deps = never changes
  
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild onClick={memoizedHandleClick} />
    </div>
  );
}
\`\`\`

## When to Use useCallback
✅ Passing callbacks to optimized child components
✅ Callbacks are dependencies of other hooks
✅ Expensive child components wrapped in React.memo
✅ Event handlers in lists

## Common Patterns

### With Dependencies
\`\`\`javascript
const handleSubmit = useCallback((data) => {
  // Uses userId in the callback
  submitData(userId, data);
}, [userId]); // Recreated when userId changes
\`\`\`

### With useEffect
\`\`\`javascript
const fetchData = useCallback(async () => {
  const response = await api.getData(id);
  setData(response);
}, [id]);

useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData is stable unless id changes
\`\`\`

## Performance Considerations
• useCallback has its own overhead
• Only use when you have a performance problem
• Measure before and after optimization
• Consider if React.memo is needed on child components

## Best Practices
✅ Use with React.memo for child components
✅ Include all dependencies in the array
✅ Use ESLint plugin for dependency checking
❌ Don't overuse - it has overhead
❌ Don't use for every callback

## useCallback vs useMemo
| useCallback | useMemo |
|-------------|---------|
| Memoizes functions | Memoizes values |
| Returns the function | Returns computed value |
| Prevents function recreation | Prevents expensive calculations |`,

  useMemo: `# useMemo Hook - Complete Guide

## What is useMemo?
useMemo returns a memoized value. It's used to optimize performance by avoiding expensive calculations on every render.

## Syntax
\`\`\`javascript
const memoizedValue = useMemo(
  () => expensiveCalculation(a, b),
  [a, b]
);
\`\`\`

## Problem it Solves
Prevents expensive calculations from running on every render when dependencies haven't changed.

## Example
\`\`\`javascript
function ExpensiveComponent({ items, filter }) {
  // Expensive calculation
  const expensiveValue = useMemo(() => {
    console.log('Calculating...');
    return items
      .filter(item => item.category === filter)
      .reduce((sum, item) => sum + item.price, 0);
  }, [items, filter]); // Only recalculate when items or filter change
  
  return <div>Total: \${expensiveValue}</div>;
}
\`\`\`

## When to Use useMemo
✅ Expensive calculations (complex filtering, sorting)
✅ Creating objects/arrays that are dependencies
✅ Preventing child component re-renders
✅ Referential equality is important

## Common Use Cases

### Expensive Calculations
\`\`\`javascript
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
\`\`\`

### Object/Array Dependencies
\`\`\`javascript
const config = useMemo(() => ({
  apiUrl: process.env.API_URL,
  timeout: 5000
}), []); // Stable object reference
\`\`\`

### Filtering Large Lists
\`\`\`javascript
const filteredUsers = useMemo(() => {
  return users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [users, searchTerm]);
\`\`\`

## Performance Considerations
• useMemo has overhead - don't overuse
• Profile your app to identify bottlenecks
• Consider if the calculation is actually expensive
• React is already fast for most operations

## Best Practices
✅ Use for genuinely expensive calculations
✅ Include all dependencies
✅ Use with React.memo for child components
✅ Measure performance impact
❌ Don't use for every calculation
❌ Don't use for primitive values unless expensive to compute

## useMemo vs useCallback
| useMemo | useCallback |
|---------|-------------|
| Memoizes computed values | Memoizes functions |
| \`useMemo(() => fn, deps)\` | \`useCallback(fn, deps)\` |
| Returns the result | Returns the function |
| For expensive calculations | For stable function references |

## Advanced Pattern - Memoized Context Value
\`\`\`javascript
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);
  
  const contextValue = useMemo(() => ({
    state,
    setState
  }), [state]);
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}
\`\`\``,

  useRef: `# useRef Hook - Complete Guide

## What is useRef?
useRef returns a mutable ref object whose .current property persists for the full lifetime of the component.

## Syntax
\`\`\`javascript
const refContainer = useRef(initialValue);
\`\`\`

## Two Main Use Cases

### 1. Accessing DOM Elements
\`\`\`javascript
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
\`\`\`

### 2. Storing Mutable Values
\`\`\`javascript
function Timer() {
  const intervalRef = useRef(null);
  const [count, setCount] = useState(0);
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
\`\`\`

## Key Characteristics
• **Mutable**: You can change .current without causing re-renders
• **Persistent**: Value persists across re-renders
• **No Re-renders**: Changing .current doesn't trigger re-renders
• **Synchronous**: Updates are immediate

## Common DOM Use Cases
• Focus management
• Text selection
• Media playback control
• Triggering animations
• Integrating with third-party DOM libraries

## Common Value Storage Use Cases
• Storing timer IDs
• Keeping track of previous values
• Storing any mutable value that doesn't need to trigger re-renders
• Caching expensive calculations

## useRef vs useState
| useRef | useState |
|--------|----------|
| Mutable .current property | Immutable state |
| No re-renders on change | Triggers re-renders |
| Synchronous updates | Asynchronous updates |
| For imperative operations | For declarative state |

## Advanced Patterns

### Previous Value Tracking
\`\`\`javascript
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
\`\`\`

### Callback Ref Pattern
\`\`\`javascript
function MeasureExample() {
  const [height, setHeight] = useState(0);
  
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  
  return (
    <div ref={measuredRef}>
      <p>Height: {height}px</p>
    </div>
  );
}
\`\`\`

## Best Practices
✅ Use for DOM access and mutable values
✅ Don't read/write .current during rendering
✅ Use callback refs for dynamic measurements
❌ Don't use as a replacement for state
❌ Don't rely on .current in render logic`,

  custom: `# Custom Hooks - Complete Guide

## What are Custom Hooks?
Custom hooks are JavaScript functions that start with "use" and can call other hooks. They let you extract component logic into reusable functions.

## Rules for Custom Hooks
1. **Must start with "use"** - This tells React it's a hook
2. **Can call other hooks** - Both built-in and custom hooks
3. **Follow Rules of Hooks** - Only call at the top level

## Basic Custom Hook Example
\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// Usage
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
\`\`\`

## Common Custom Hook Patterns

### 1. Data Fetching Hook
\`\`\`javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}
\`\`\`

### 2. Local Storage Hook
\`\`\`javascript
function useLocalStorage(key, initialValue) {
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
      console.error('Error saving to localStorage:', error);
    }
  };
  
  return [storedValue, setValue];
}
\`\`\`

### 3. Window Size Hook
\`\`\`javascript
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call handler right away
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}
\`\`\`

### 4. Toggle Hook
\`\`\`javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, toggle, setTrue, setFalse];
}
\`\`\`

## Benefits of Custom Hooks
✅ **Reusability**: Share logic between components
✅ **Separation of Concerns**: Keep components focused on rendering
✅ **Testability**: Test logic in isolation
✅ **Composition**: Combine multiple hooks easily
✅ **Abstraction**: Hide complex logic behind simple interfaces

## Best Practices
✅ Start with "use" prefix
✅ Return objects for multiple values (easier to extend)
✅ Use TypeScript for better developer experience
✅ Keep hooks focused on single responsibility
✅ Document your custom hooks well
❌ Don't call hooks conditionally
❌ Don't overcomplicate simple logic

## Testing Custom Hooks
\`\`\`javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
\`\`\`

## Advanced Patterns

### Hook Composition
\`\`\`javascript
function useUserProfile(userId) {
  const { data: user, loading } = useFetch(\`/api/users/\${userId}\`);
  const [preferences, setPreferences] = useLocalStorage('userPrefs', {});
  
  return {
    user,
    loading,
    preferences,
    setPreferences
  };
}
\`\`\`

Custom hooks are one of the most powerful features of React hooks, allowing you to create reusable, testable, and composable logic!`
};

const NotesPanel: React.FC<NotesPanelProps> = ({ hookId, isOpen, onClose }) => {
  const { progress, updateProgress } = useLearning();
  const [notes, setNotes] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'guide'>('guide');

  useEffect(() => {
    if (hookId && progress[hookId]) {
      setNotes(progress[hookId].notes || '');
      setHasUnsavedChanges(false);
    }
  }, [hookId, progress]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setHasUnsavedChanges(true);
  };

  const saveNotes = () => {
    updateProgress(hookId, { notes });
    setHasUnsavedChanges(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveNotes();
    }
  };

  const loadDefaultNotes = () => {
    const defaultContent = defaultNotes[hookId as keyof typeof defaultNotes] || '';
    setNotes(defaultContent);
    setHasUnsavedChanges(true);
  };

  const getHookTitle = (hookId: string) => {
    const titles = {
      useState: 'useState Hook',
      useEffect: 'useEffect Hook',
      useContext: 'useContext Hook',
      useReducer: 'useReducer Hook',
      useCallback: 'useCallback Hook',
      useMemo: 'useMemo Hook',
      useRef: 'useRef Hook',
      custom: 'Custom Hooks'
    };
    return titles[hookId as keyof typeof titles] || hookId;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex-shrink-0 bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{getHookTitle(hookId)}</h3>
                    <p className="text-blue-100 text-sm">Learning Resources</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex bg-white/20 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'guide'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Lightbulb size={16} />
                  Study Guide
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'notes'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <StickyNote size={16} />
                  My Notes
                  {hasUnsavedChanges && (
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {activeTab === 'guide' ? (
                <div className="h-full overflow-y-auto p-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-600 rounded-xl">
                          <Target size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-blue-900 text-lg">Study Guide</span>
                      </div>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        Comprehensive guide with examples, best practices, and patterns.
                      </p>
                    </div>
                    
                    <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                      {defaultNotes[hookId as keyof typeof defaultNotes] || 'No study guide available for this hook.'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 p-6">
                    {notes.trim() === '' && (
                      <div className="text-center py-12">
                        <div className="p-6 bg-slate-50 rounded-2xl mb-6 inline-block">
                          <StickyNote size={64} className="text-slate-300 mx-auto" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-600 mb-3">No Notes Yet</h4>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                          Start taking personalized notes or load the study guide.
                        </p>
                        <button
                          onClick={loadDefaultNotes}
                          className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors mx-auto shadow-lg font-semibold"
                        >
                          <Plus size={18} />
                          Load Study Guide
                        </button>
                      </div>
                    )}
                    
                    {notes.trim() !== '' && (
                      <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Take notes about this hook... (Ctrl+S to save)"
                        className="w-full h-full resize-none border border-slate-200 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed bg-slate-50"
                      />
                    )}
                  </div>

                  <div className="flex-shrink-0 p-6 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs">
                        {hasUnsavedChanges ? (
                          <span className="flex items-center gap-2 text-amber-600 font-medium">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            Unsaved changes
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-emerald-600 font-medium">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            All changes saved
                          </span>
                        )}
                      </div>
                      <button
                        onClick={saveNotes}
                        disabled={!hasUnsavedChanges}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                      >
                        <Save size={16} />
                        Save
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Code size={12} />
                      <span>Tip: Use Ctrl+S to save quickly</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotesPanel;