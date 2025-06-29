import React, { useState, useEffect, useRef } from 'react';
import CodeBlock from '../CodeBlock';
import { Clock, Users, Wifi, Monitor, Bell, Play, Pause, RotateCcw, AlertCircle, CheckCircle, Activity } from 'lucide-react';

const UseEffectExample: React.FC = () => {
  // Timer states
  const [time, setTime] = useState(new Date());
  const [timerCount, setTimerCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Data fetching states
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Window size tracking
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  // Mouse position tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseTracking, setIsMouseTracking] = useState(false);
  
  // Document title tracking
  const [titleCount, setTitleCount] = useState(0);
  
  // Network status
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Scroll position
  const [scrollY, setScrollY] = useState(0);
  
  // Cleanup demonstration
  const [showCleanupDemo, setShowCleanupDemo] = useState(false);
  
  // Refs for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const clockRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Effect with cleanup (clock)
  useEffect(() => {
    console.log('Clock effect mounted');
    
    clockRef.current = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      console.log('Clock effect cleanup');
      if (clockRef.current) {
        clearInterval(clockRef.current);
      }
    };
  }, []); // Empty dependency array - runs once

  // 2. Effect with dependency (document title)
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `Count: ${titleCount} - React Hooks Portal`;
    
    return () => {
      document.title = originalTitle;
    };
  }, [titleCount]); // Runs when titleCount changes

  // 3. Timer effect with dependencies
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerCount(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // 4. Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 5. Mouse position tracking (conditional effect)
  useEffect(() => {
    if (!isMouseTracking) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMouseTracking]);

  // 6. Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 7. Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 8. Data fetching effect
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 9. Effect for data fetching on mount
  useEffect(() => {
    fetchUsers();
  }, []); // Runs once on mount

  // 10. Cleanup demonstration component
  const CleanupDemo: React.FC = () => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      console.log('CleanupDemo effect mounted');
      
      const interval = setInterval(() => {
        setCount(prev => {
          console.log('CleanupDemo interval tick:', prev + 1);
          return prev + 1;
        });
      }, 1000);
      
      return () => {
        console.log('CleanupDemo effect cleanup');
        clearInterval(interval);
      };
    }, []);
    
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={20} className="text-amber-600" />
          <h4 className="font-semibold text-amber-900">Cleanup Demo Component</h4>
        </div>
        <div className="text-2xl font-bold text-amber-800 mb-2">{count}</div>
        <p className="text-amber-700 text-sm">
          This component will be unmounted when you toggle it off. 
          Check the console to see the cleanup function being called.
        </p>
      </div>
    );
  };

  const basicEffectCode = `// Basic useEffect - runs after every render
useEffect(() => {
  console.log('Component rendered');
});

// Effect with cleanup - runs once on mount
useEffect(() => {
  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  // Cleanup function
  return () => clearInterval(timer);
}, []); // Empty dependency array

// Effect with dependencies - runs when dependencies change
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]); // Runs when count changes`;

  const dataFetchingCode = `// Data fetching pattern
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []); // Fetch once on mount`;

  const eventListenerCode = `// Event listener pattern
useEffect(() => {
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  // Add event listener
  window.addEventListener('resize', handleResize);
  
  // Call immediately to set initial value
  handleResize();
  
  // Cleanup - remove event listener
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // Empty deps - setup once`;

  const conditionalEffectCode = `// Conditional effects
useEffect(() => {
  // Early return if condition not met
  if (!isTracking) return;

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  document.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
}, [isTracking]); // Re-run when tracking state changes`;

  const dependencyArrayCode = `// Different dependency array patterns

// 1. No dependency array - runs after every render
useEffect(() => {
  console.log('Runs after every render');
});

// 2. Empty dependency array - runs once on mount
useEffect(() => {
  console.log('Runs once on mount');
}, []);

// 3. With dependencies - runs when dependencies change
useEffect(() => {
  console.log('Runs when count or name changes');
}, [count, name]);

// 4. Multiple effects for different concerns
useEffect(() => {
  // Handle count changes
}, [count]);

useEffect(() => {
  // Handle name changes  
}, [name]);`;

  const cleanupPatternsCode = `// Common cleanup patterns

// 1. Timers and intervals
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Timer executed');
  }, 1000);
  
  return () => clearTimeout(timer);
}, []);

// 2. Event listeners
useEffect(() => {
  const handleClick = () => console.log('Clicked');
  document.addEventListener('click', handleClick);
  
  return () => document.removeEventListener('click', handleClick);
}, []);

// 3. Subscriptions
useEffect(() => {
  const subscription = api.subscribe(data => {
    setData(data);
  });
  
  return () => subscription.unsubscribe();
}, []);

// 4. Async operations with AbortController
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    });
  
  return () => controller.abort();
}, []);`;

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-6">useEffect Hook - Complete Guide</h2>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-purple-900 mb-4">What is useEffect?</h3>
          <p className="text-lg text-purple-800 leading-relaxed mb-4">
            useEffect lets you perform side effects in functional components. It serves the same purpose as 
            componentDidMount, componentDidUpdate, and componentWillUnmount combined in React class components.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-purple-200">
              <div className="text-purple-600 font-semibold mb-2">Side Effects</div>
              <div className="text-sm text-purple-700">Data fetching, subscriptions, DOM manipulation</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-200">
              <div className="text-purple-600 font-semibold mb-2">Cleanup</div>
              <div className="text-sm text-purple-700">Prevent memory leaks and cancel operations</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-200">
              <div className="text-purple-600 font-semibold mb-2">Dependencies</div>
              <div className="text-sm text-purple-700">Control when effects run</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Clock */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">1. Timer with Cleanup (No Dependencies)</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="text-blue-500" size={32} />
              <h4 className="text-xl font-semibold text-slate-800">Real-time Clock</h4>
            </div>
            <div className="text-4xl font-mono font-bold text-blue-600 bg-blue-50 p-6 rounded-xl border border-blue-200">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
              <strong>Effect Pattern:</strong> Empty dependency array <code className="bg-slate-200 px-2 py-1 rounded">[]</code> means this effect runs once on mount and cleans up on unmount.
            </div>
          </div>
        </div>
      </div>

      {/* Document Title Effect */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">2. Effect with Dependencies</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center space-y-6">
            <h4 className="text-xl font-semibold text-slate-800">Document Title Updater</h4>
            <div className="text-4xl font-bold text-emerald-600">{titleCount}</div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setTitleCount(prev => prev - 1)}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Decrement
              </button>
              <button
                onClick={() => setTitleCount(0)}
                className="px-6 py-3 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Reset
              </button>
              <button
                onClick={() => setTitleCount(prev => prev + 1)}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Increment
              </button>
            </div>
            <div className="text-sm text-slate-600 bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <strong>Check the browser tab title!</strong> The effect runs whenever <code className="bg-amber-200 px-2 py-1 rounded">titleCount</code> changes.
            </div>
          </div>
        </div>
      </div>

      {/* Timer Control */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">3. Conditional Effects & Timer Control</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Activity className="text-purple-500" size={32} />
              <h4 className="text-xl font-semibold text-slate-800">Controllable Timer</h4>
            </div>
            <div className="text-5xl font-mono font-bold text-purple-600 bg-purple-50 p-8 rounded-xl border border-purple-200">
              {Math.floor(timerCount / 60).toString().padStart(2, '0')}:
              {(timerCount % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold ${
                  isTimerRunning 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => {
                  setTimerCount(0);
                  setIsTimerRunning(false);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
            <div className="text-sm text-slate-600 bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <strong>Effect Dependencies:</strong> The timer effect depends on <code className="bg-blue-200 px-2 py-1 rounded">isTimerRunning</code> and re-runs when it changes.
            </div>
          </div>
        </div>
      </div>

      {/* Window Size Tracking */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">4. Event Listeners & Window Tracking</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Monitor className="text-indigo-500" size={32} />
                <h4 className="text-xl font-semibold text-slate-800">Window Size</h4>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-indigo-600 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                  {windowSize.width} × {windowSize.height}
                </div>
                <p className="text-sm text-slate-600">Resize the window to see changes</p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Wifi className={`${isOnline ? 'text-emerald-500' : 'text-red-500'}`} size={32} />
                <h4 className="text-xl font-semibold text-slate-800">Network Status</h4>
              </div>
              <div className={`text-2xl font-bold p-4 rounded-xl border ${
                isOnline 
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </div>
              <p className="text-sm text-slate-600">
                Try disconnecting your internet to see the change
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="text-lg font-semibold text-slate-800 mb-2">Scroll Position</div>
            <div className="text-2xl font-bold text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200 inline-block">
              {scrollY}px
            </div>
            <p className="text-sm text-slate-600 mt-2">Scroll the page to see the position change</p>
          </div>
        </div>
      </div>

      {/* Mouse Tracking */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">5. Conditional Event Listeners</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <h4 className="text-xl font-semibold text-slate-800">Mouse Position Tracker</h4>
              <button
                onClick={() => setIsMouseTracking(!isMouseTracking)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isMouseTracking 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {isMouseTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>
            </div>
            
            {isMouseTracking && (
              <div className="space-y-4">
                <div className="text-3xl font-bold text-blue-600 bg-blue-50 p-6 rounded-xl border border-blue-200">
                  X: {mousePosition.x}, Y: {mousePosition.y}
                </div>
                <p className="text-sm text-slate-600">Move your mouse to see coordinates</p>
              </div>
            )}
            
            {!isMouseTracking && (
              <div className="text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-200">
                Mouse tracking is disabled. Click "Start Tracking" to begin.
              </div>
            )}
            
            <div className="text-sm text-slate-600 bg-purple-50 border border-purple-200 p-4 rounded-xl">
              <strong>Conditional Effect:</strong> The mouse tracking effect only runs when <code className="bg-purple-200 px-2 py-1 rounded">isMouseTracking</code> is true.
            </div>
          </div>
        </div>
      </div>

      {/* Data Fetching */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">6. Data Fetching with useEffect</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-blue-500" size={32} />
                <h4 className="text-xl font-semibold text-slate-800">User Data</h4>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Wifi size={20} />
                    Refetch Data
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <div className="font-semibold text-red-900">Error occurred:</div>
                  <div className="text-red-800">{error}</div>
                </div>
              </div>
            )}
            
            {users.length > 0 && !loading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Data loaded successfully!</span>
                </div>
                {users.map(user => (
                  <div key={user.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-sm text-slate-600">{user.email}</div>
                    <div className="text-sm text-slate-500">{user.company?.name}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-sm text-slate-600 bg-green-50 border border-green-200 p-4 rounded-xl">
              <strong>Data Fetching Pattern:</strong> Effect runs once on mount to fetch initial data. 
              Always handle loading states and errors in async operations.
            </div>
          </div>
        </div>
      </div>

      {/* Cleanup Demonstration */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">7. Effect Cleanup Demonstration</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold text-slate-800">Component Lifecycle</h4>
              <button
                onClick={() => setShowCleanupDemo(!showCleanupDemo)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  showCleanupDemo 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {showCleanupDemo ? 'Unmount Component' : 'Mount Component'}
              </button>
            </div>
            
            {showCleanupDemo && <CleanupDemo />}
            
            {!showCleanupDemo && (
              <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 mb-4">Component is unmounted</div>
                <p className="text-sm text-slate-600">
                  Click "Mount Component" to see the effect in action. 
                  Check the browser console to see mount and cleanup logs.
                </p>
              </div>
            )}
            
            <div className="text-sm text-slate-600 bg-orange-50 border border-orange-200 p-4 rounded-xl">
              <strong>Cleanup Function:</strong> Always clean up subscriptions, timers, and event listeners 
              to prevent memory leaks. The cleanup function runs before the component unmounts and before the effect runs again.
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-8">
        <h3 className="text-3xl font-bold text-slate-800">Code Examples & Patterns</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Basic useEffect Patterns</h4>
            <CodeBlock code={basicEffectCode} title="Effect Fundamentals" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Data Fetching Pattern</h4>
            <CodeBlock code={dataFetchingCode} title="Async Operations" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Event Listeners</h4>
            <CodeBlock code={eventListenerCode} title="DOM Event Handling" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Conditional Effects</h4>
            <CodeBlock code={conditionalEffectCode} title="Dynamic Effect Behavior" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Dependency Arrays</h4>
            <CodeBlock code={dependencyArrayCode} title="Controlling Effect Execution" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">Cleanup Patterns</h4>
            <CodeBlock code={cleanupPatternsCode} title="Preventing Memory Leaks" />
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">useEffect Best Practices & Patterns</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              Best Practices
            </h4>
            <ul className="space-y-3 text-emerald-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Always include dependencies in the dependency array</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use multiple effects to separate concerns</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Always clean up subscriptions and timers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use AbortController for cancelling fetch requests</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Handle loading and error states in async effects</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              Common Pitfalls
            </h4>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Forgetting to include dependencies (causes stale closures)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Not cleaning up subscriptions (memory leaks)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Using objects/arrays as dependencies without memoization</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Calling async functions directly in useEffect</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Infinite loops from missing or incorrect dependencies</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Effect Execution Timeline</h4>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-800 mb-2">1. Component Mounts</div>
              <div className="text-blue-700">Effects with empty deps run</div>
            </div>
            <div>
              <div className="font-medium text-blue-800 mb-2">2. State Updates</div>
              <div className="text-blue-700">Effects with matching deps run</div>
            </div>
            <div>
              <div className="font-medium text-blue-800 mb-2">3. Before Re-run</div>
              <div className="text-blue-700">Previous cleanup functions execute</div>
            </div>
            <div>
              <div className="font-medium text-blue-800 mb-2">4. Component Unmounts</div>
              <div className="text-blue-700">All cleanup functions execute</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseEffectExample;