import React, { useState, useCallback } from 'react';
import CodeBlock from '../CodeBlock';
import { Plus, Minus, RotateCcw, Users, ShoppingCart, Eye, EyeOff, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

const UseStateExample: React.FC = () => {
  // Basic counter state
  const [count, setCount] = useState(0);
  
  // String state for form input
  const [name, setName] = useState('');
  
  // Boolean state for visibility toggle
  const [isVisible, setIsVisible] = useState(true);
  
  // Object state for user profile
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 18,
    preferences: {
      theme: 'light',
      notifications: true
    }
  });
  
  // Array state for todo list
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn useState', completed: false },
    { id: 2, text: 'Build a React app', completed: false }
  ]);
  
  // Complex state with validation
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    errors: {}
  });
  
  // Lazy initial state example
  const [expensiveData, setExpensiveData] = useState(() => {
    console.log('Computing expensive initial state...');
    return Array.from({ length: 1000 }, (_, i) => ({ id: i, value: Math.random() }));
  });
  
  // Multiple related states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Functional updates
  const incrementCount = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setCount(prevCount => prevCount - 1);
  }, []);

  // Object state updates (immutable)
  const updateUserName = (newName: string) => {
    setUser(prevUser => ({
      ...prevUser,
      name: newName
    }));
  };

  const updateUserPreferences = (key: string, value: any) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        [key]: value
      }
    }));
  };

  // Array state updates
  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: `New todo ${todos.length + 1}`,
      completed: false
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Form validation with state
  const validateForm = (data: any) => {
    const errors: any = {};
    
    if (!data.username || data.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!data.password || data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      const errors = validateForm(newData);
      return { ...newData, errors };
    });
  };

  // Async state updates simulation
  const simulateAsyncOperation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (Math.random() > 0.7) {
        throw new Error('Random error occurred');
      }
      
      setData({ message: 'Data loaded successfully!', timestamp: new Date().toISOString() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const basicStateCode = `// Basic useState syntax
const [state, setState] = useState(initialValue);

// Examples
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [isVisible, setIsVisible] = useState(true);

// Updating state
setCount(count + 1);           // Direct update
setCount(prev => prev + 1);    // Functional update (preferred)`;

  const objectStateCode = `// Object state management
const [user, setUser] = useState({
  name: '',
  email: '',
  preferences: { theme: 'light' }
});

// ❌ Wrong - mutating state
user.name = 'John';
setUser(user);

// ✅ Correct - creating new object
setUser(prevUser => ({
  ...prevUser,
  name: 'John'
}));

// ✅ Nested object updates
setUser(prevUser => ({
  ...prevUser,
  preferences: {
    ...prevUser.preferences,
    theme: 'dark'
  }
}));`;

  const arrayStateCode = `// Array state management
const [todos, setTodos] = useState([]);

// ❌ Wrong - mutating array
todos.push(newTodo);
setTodos(todos);

// ✅ Correct - creating new array
setTodos(prevTodos => [...prevTodos, newTodo]);

// Update item in array
setTodos(prevTodos =>
  prevTodos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
);

// Remove item from array
setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));`;

  const lazyInitialStateCode = `// Lazy initial state for expensive computations
const [data, setData] = useState(() => {
  console.log('This only runs once!');
  return expensiveComputation();
});

// vs regular initial state (runs on every render)
const [data, setData] = useState(expensiveComputation());

// Practical example
const [users, setUsers] = useState(() => {
  const saved = localStorage.getItem('users');
  return saved ? JSON.parse(saved) : [];
});`;

  const functionalUpdatesCode = `// Functional updates - when new state depends on previous state
const [count, setCount] = useState(0);

// ❌ Potential issue with stale closures
const increment = () => setCount(count + 1);

// ✅ Always gets latest state
const increment = () => setCount(prev => prev + 1);

// Multiple updates in sequence
const handleMultipleUpdates = () => {
  setCount(prev => prev + 1);  // These will be batched
  setCount(prev => prev + 1);  // and executed in order
  setCount(prev => prev + 1);
};`;

  const batchingCode = `// State batching in React 18+
const handleClick = () => {
  setCount(prev => prev + 1);    // Batched
  setName('John');               // Batched
  setIsVisible(false);           // Batched
  // Only one re-render occurs
};

// Async operations are also batched in React 18
const handleAsyncClick = async () => {
  await fetch('/api/data');
  setCount(prev => prev + 1);    // Batched
  setName('John');               // Batched
  // Only one re-render occurs
};`;

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-6">useState Hook - Complete Guide</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">What is useState?</h3>
          <p className="text-lg text-blue-800 leading-relaxed mb-4">
            useState is the fundamental React Hook for adding state to functional components. It allows you to 
            declare state variables and provides a function to update them, triggering re-renders when the state changes.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="text-blue-600 font-semibold mb-2">State Variable</div>
              <div className="text-sm text-blue-700">Current value of the state</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="text-blue-600 font-semibold mb-2">Setter Function</div>
              <div className="text-sm text-blue-700">Function to update the state</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="text-blue-600 font-semibold mb-2">Re-rendering</div>
              <div className="text-sm text-blue-700">Component re-renders when state changes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Examples */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Counter Example */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800">1. Basic Counter</h3>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-blue-600">{count}</div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={decrementCount}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Minus size={20} />
                  Decrement
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
                <button
                  onClick={incrementCount}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  Increment
                </button>
              </div>
              <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                <strong>Functional Updates:</strong> Using <code className="bg-slate-200 px-2 py-1 rounded">{'prev => prev + 1'}</code> ensures we always get the latest state value.
              </div>
            </div>
          </div>
        </div>

        {/* Input Example */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800">2. Form Input Handling</h3>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Enter your name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type your name..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="text-lg font-semibold text-blue-900 mb-2">Live Preview:</div>
                <p className="text-blue-800">
                  {name ? `Hello, ${name}! 👋` : 'Please enter your name above'}
                </p>
                <div className="text-sm text-blue-600 mt-2">
                  Character count: {name.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">3. Boolean State Toggle</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              {isVisible ? 'Hide' : 'Show'} Content
            </button>
            
            <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
              {isVisible && (
                <div className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={24} className="text-emerald-600" />
                    <h4 className="text-xl font-bold text-emerald-900">Content is Visible!</h4>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    This content is conditionally rendered based on the boolean state. 
                    Boolean states are perfect for toggles, modals, loading states, and feature flags.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Object State Management */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">4. Object State Management</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <Users size={20} />
                User Profile
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => updateUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={user.age}
                    onChange={(e) => setUser(prev => ({ ...prev, age: parseInt(e.target.value) || 18 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="18"
                    max="100"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Preferences</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={user.preferences.notifications}
                        onChange={(e) => updateUserPreferences('notifications', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Enable notifications</span>
                    </label>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700">Theme:</span>
                      <select
                        value={user.preferences.theme}
                        onChange={(e) => updateUserPreferences('theme', e.target.value)}
                        className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-700">Current State</h4>
              <div className="bg-slate-50 p-6 rounded-xl">
                <pre className="text-sm text-slate-800 whitespace-pre-wrap">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              <div className="text-sm text-slate-600 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <strong>Key Point:</strong> Always use the spread operator to create new objects when updating state. 
                Never mutate the existing state object directly.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Array State Management */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">5. Array State Management</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <ShoppingCart size={20} />
                Todo List ({todos.length} items)
              </h4>
              <button
                onClick={addTodo}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={16} />
                Add Todo
              </button>
            </div>
            
            <div className="space-y-3">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    todo.completed 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-slate-600 bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <strong>Array Operations:</strong> Use spread operator for adding, map() for updating, and filter() for removing items. 
              Never use push(), pop(), or splice() directly on state arrays.
            </div>
          </div>
        </div>
      </div>

      {/* Form Validation */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">6. Form Validation with State</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-slate-700">Registration Form</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formData.errors.username 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter username"
                  />
                  {formData.errors.username && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      {formData.errors.username}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleFormChange('password', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formData.errors.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter password"
                  />
                  {formData.errors.password && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      {formData.errors.password}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formData.errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                    placeholder="Confirm password"
                  />
                  {formData.errors.confirmPassword && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      {formData.errors.confirmPassword}
                    </div>
                  )}
                </div>
                
                <button
                  disabled={Object.keys(formData.errors).length > 0 || !formData.username || !formData.password}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Register
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-700">Form State</h4>
              <div className="bg-slate-50 p-6 rounded-xl">
                <pre className="text-sm text-slate-800 whitespace-pre-wrap">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Async State Management */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">7. Async Operations with State</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-700">API Simulation</h4>
              <button
                onClick={simulateAsyncOperation}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  'Simulate API Call'
                )}
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${loading ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-sm font-medium text-slate-700 mb-2">Loading State</div>
                <div className={`text-lg font-bold ${loading ? 'text-blue-600' : 'text-slate-400'}`}>
                  {loading ? 'Loading...' : 'Idle'}
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border ${error ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-sm font-medium text-slate-700 mb-2">Error State</div>
                <div className={`text-lg font-bold ${error ? 'text-red-600' : 'text-slate-400'}`}>
                  {error || 'No Error'}
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border ${data ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-sm font-medium text-slate-700 mb-2">Data State</div>
                <div className={`text-lg font-bold ${data ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {data ? 'Success' : 'No Data'}
                </div>
              </div>
            </div>
            
            {data && (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h5 className="font-semibold text-emerald-900 mb-2">Response Data:</h5>
                <pre className="text-sm text-emerald-800 whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
            
            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 text-red-900">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Error occurred:</span>
                </div>
                <p className="text-red-800 mt-2">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-8">
        <h3 className="text-3xl font-bold text-slate-800">Code Examples & Best Practices</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Basic useState Patterns</h4>
            <CodeBlock code={basicStateCode} title="Basic State Management" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Object State Updates</h4>
            <CodeBlock code={objectStateCode} title="Immutable Object Updates" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Array State Updates</h4>
            <CodeBlock code={arrayStateCode} title="Immutable Array Operations" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Lazy Initial State</h4>
            <CodeBlock code={lazyInitialStateCode} title="Performance Optimization" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Functional Updates</h4>
            <CodeBlock code={functionalUpdatesCode} title="Avoiding Stale Closures" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">State Batching</h4>
            <CodeBlock code={batchingCode} title="React 18 Automatic Batching" />
          </div>
        </div>
      </div>

      {/* Best Practices Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-emerald-900 mb-6">useState Best Practices & Key Concepts</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              Do's
            </h4>
            <ul className="space-y-3 text-emerald-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use functional updates when new state depends on previous state</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Always create new objects/arrays instead of mutating existing ones</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use lazy initial state for expensive computations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Split unrelated state into multiple useState calls</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use useCallback for event handlers to prevent unnecessary re-renders</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              Don'ts
            </h4>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Don't mutate state directly (state.push(), state.property = value)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Don't call hooks inside loops, conditions, or nested functions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Don't use state for values that don't trigger re-renders (use useRef)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Don't put all state in a single object if pieces are unrelated</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Don't forget that state updates are asynchronous</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-xl border border-emerald-200">
          <h4 className="text-lg font-semibold text-emerald-900 mb-3">Performance Considerations</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-emerald-800 mb-2">State Batching</div>
              <div className="text-emerald-700">React automatically batches multiple state updates in event handlers</div>
            </div>
            <div>
              <div className="font-medium text-emerald-800 mb-2">Lazy Initialization</div>
              <div className="text-emerald-700">Use functions for expensive initial state calculations</div>
            </div>
            <div>
              <div className="font-medium text-emerald-800 mb-2">Functional Updates</div>
              <div className="text-emerald-700">Prevent stale closures and ensure correct state updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseStateExample;