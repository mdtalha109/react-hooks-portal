import React, { useState, useCallback, useMemo } from 'react';
import CodeBlock from '../CodeBlock';
import { Timer, Users, Search, Zap } from 'lucide-react';

// Expensive child component that we want to optimize
const ExpensiveUserList = React.memo<{
  users: Array<{ id: number; name: string; email: string }>;
  onUserClick: (id: number) => void;
  filter: string;
}>(({ users, onUserClick, filter }) => {
  console.log('ExpensiveUserList rendered');
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 mb-2">
        Showing {filteredUsers.length} users (check console for renders)
      </div>
      {filteredUsers.map(user => (
        <div
          key={user.id}
          onClick={() => onUserClick(user.id)}
          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-600">{user.email}</div>
        </div>
      ))}
    </div>
  );
});

// Timer component to demonstrate useCallback with dependencies
const OptimizedTimer: React.FC<{ onTick: (time: number) => void }> = React.memo(({ onTick }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newTime = prev + 1;
          onTick(newTime);
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, onTick]);

  return (
    <div className="text-center space-y-4">
      <div className="text-3xl font-mono font-bold text-blue-600">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={() => {
            setSeconds(0);
            setIsRunning(false);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
});

const UseCallbackExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [timerLog, setTimerLog] = useState<string[]>([]);

  // Sample users data
  const users = useMemo(() => [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com' },
  ], []);

  // Without useCallback - this function is recreated on every render
  const handleUserClickBad = (id: number) => {
    setSelectedUserId(id);
  };

  // With useCallback - this function is memoized
  const handleUserClick = useCallback((id: number) => {
    setSelectedUserId(id);
  }, []); // No dependencies, so function never changes

  // useCallback with dependencies
  const handleTimerTick = useCallback((time: number) => {
    const timestamp = new Date().toLocaleTimeString();
    setTimerLog(prev => [...prev.slice(-4), `${timestamp}: ${time}s`]);
  }, []); // Empty deps - function reference stays the same

  // Function that depends on state
  const handleUserClickWithCount = useCallback((id: number) => {
    setSelectedUserId(id);
    console.log(`User ${id} clicked when count was ${count}`);
  }, [count]); // Recreated when count changes

  const basicCallbackCode = `// Without useCallback - recreated every render
const handleClick = (id) => {
  setSelectedUserId(id);
};

// With useCallback - memoized
const handleClick = useCallback((id) => {
  setSelectedUserId(id);
}, []); // Empty deps = never changes

// Child component wrapped in React.memo
const ExpensiveChild = React.memo(({ onClick }) => {
  // Only re-renders if onClick reference changes
  return <button onClick={onClick}>Click me</button>;
});`;

  const dependencyCallbackCode = `// useCallback with dependencies
const handleUserClick = useCallback((id) => {
  setSelectedUserId(id);
  console.log(\`User \${id} clicked when count was \${count}\`);
}, [count]); // Recreated when count changes

// Function reference changes only when dependencies change
useEffect(() => {
  // This effect runs when handleUserClick changes
  console.log('handleUserClick changed');
}, [handleUserClick]);`;

  const optimizationCode = `// Optimized component with React.memo and useCallback
const ExpensiveList = React.memo(({ items, onItemClick }) => {
  console.log('ExpensiveList rendered');
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});

function Parent() {
  const [count, setCount] = useState(0);
  const [items] = useState([...]);
  
  // Memoized callback prevents unnecessary re-renders
  const handleItemClick = useCallback((id) => {
    console.log('Item clicked:', id);
  }, []);
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ExpensiveList items={items} onItemClick={handleItemClick} />
    </div>
  );
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">useCallback Hook</h2>
        <p className="text-lg text-gray-600 mb-6">
          The useCallback hook returns a memoized callback function. It's used to optimize performance by preventing unnecessary re-renders of child components that depend on callback functions.
        </p>
      </div>

      {/* Performance Demo */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-yellow-600" size={20} />
          <h3 className="text-lg font-semibold text-yellow-900">Performance Demonstration</h3>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Counter (causes re-renders):</span>
              <button
                onClick={() => setCount(c => c + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Count: {count}
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Filter users:
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Selected User ID: {selectedUserId || 'None'}
            </div>
            <div className="text-xs text-gray-600">
              Open browser console to see render logs
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* User List Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users size={20} />
            Optimized User List
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <ExpensiveUserList
              users={users}
              onUserClick={handleUserClick}
              filter={filter}
            />
          </div>
        </div>

        {/* Timer Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Timer size={20} />
            Timer with Callback
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <OptimizedTimer onTick={handleTimerTick} />
            
            {timerLog.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Timer Log:</div>
                <div className="space-y-1">
                  {timerLog.map((log, index) => (
                    <div key={index} className="text-xs text-gray-600 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic useCallback Pattern</h3>
          <CodeBlock code={basicCallbackCode} title="Memoizing Callbacks" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">useCallback with Dependencies</h3>
          <CodeBlock code={dependencyCallbackCode} title="Dependencies Array" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Optimization</h3>
          <CodeBlock code={optimizationCode} title="React.memo + useCallback" />
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">When to Use useCallback</h4>
        <div className="grid md:grid-cols-2 gap-6 text-blue-800">
          <div>
            <h5 className="font-semibold mb-2 text-green-700">✅ Good Use Cases:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Passing callbacks to optimized child components</li>
              <li>• Callbacks as dependencies in other hooks</li>
              <li>• Event handlers in large lists</li>
              <li>• Preventing expensive child re-renders</li>
              <li>• Stable function references needed</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-red-700">❌ Avoid When:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Child components aren't memoized</li>
              <li>• Callback is simple and cheap to recreate</li>
              <li>• No performance issues exist</li>
              <li>• Overusing without measuring impact</li>
              <li>• Dependencies change frequently</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCallbackExample;