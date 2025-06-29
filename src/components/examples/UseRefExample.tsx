import React, { useRef, useState, useEffect } from 'react';
import CodeBlock from '../CodeBlock';
import { Focus, Timer, Camera, Volume2 } from 'lucide-react';

const UseRefExample: React.FC = () => {
  // DOM refs
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Value refs
  const countRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousValueRef = useRef<string>('');
  
  // State for demonstrations
  const [inputValue, setInputValue] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  const [timerCount, setTimerCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Track previous value
  useEffect(() => {
    previousValueRef.current = inputValue;
  });

  // Focus input
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Clear input
  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setInputValue('');
      inputRef.current.focus();
    }
  };

  // Timer functions
  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      intervalRef.current = setInterval(() => {
        setTimerCount(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsTimerRunning(false);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimerCount(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Count renders without causing re-renders
  countRef.current += 1;

  // Video controls
  const playVideo = () => {
    videoRef.current?.play();
  };

  const pauseVideo = () => {
    videoRef.current?.pause();
  };

  // Canvas drawing
  const drawOnCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(10, 10, 100, 50);
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(160, 35, 25, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.moveTo(220, 10);
        ctx.lineTo(270, 10);
        ctx.lineTo(245, 60);
        ctx.closePath();
        ctx.fill();
      }
    }
  };

  const domRefCode = `// DOM element refs
const inputRef = useRef(null);
const videoRef = useRef(null);

// Accessing DOM elements
const focusInput = () => {
  inputRef.current?.focus();
};

const playVideo = () => {
  videoRef.current?.play();
};

// JSX
<input ref={inputRef} type="text" />
<video ref={videoRef} src="video.mp4" />`;

  const valueRefCode = `// Storing mutable values
const countRef = useRef(0);
const intervalRef = useRef(null);
const previousValueRef = useRef('');

// Timer example
const startTimer = () => {
  intervalRef.current = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
};

const stopTimer = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};

// Tracking previous values
useEffect(() => {
  previousValueRef.current = value;
});`;

  const customHookCode = `// Custom hook for previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Custom hook for interval
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">useRef Hook</h2>
        <p className="text-lg text-gray-600 mb-6">
          The useRef hook returns a mutable ref object whose .current property persists for the full lifetime of the component. It has two main use cases: accessing DOM elements and storing mutable values that don't trigger re-renders.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* DOM Access Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Focus size={20} />
            DOM Element Access
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Controlled Input:
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type something..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={focusInput}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Focus Input
                </button>
                <button
                  onClick={clearInput}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear & Focus
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700">
                  <div>Current value: <span className="font-mono">{inputValue || '(empty)'}</span></div>
                  <div>Previous value: <span className="font-mono">{previousValueRef.current || '(empty)'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Timer size={20} />
            Timer with Cleanup
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center space-y-4">
              <div className="text-4xl font-mono font-bold text-blue-600">
                {Math.floor(timerCount / 60)}:{(timerCount % 60).toString().padStart(2, '0')}
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={startTimer}
                  disabled={isTimerRunning}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={stopTimer}
                  disabled={!isTimerRunning}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  Stop
                </button>
                <button
                  onClick={resetTimer}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  Timer ID stored in ref: {intervalRef.current ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Counter */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Render Counter (No Re-renders)</h3>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                Render Count: {countRef.current}
              </div>
              <div className="text-sm text-gray-600">
                This counter increments on every render without causing re-renders
              </div>
            </div>
            <button
              onClick={() => setRenderCount(prev => prev + 1)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Force Re-render ({renderCount})
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Camera size={20} />
          Canvas Manipulation
        </h3>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              width={300}
              height={80}
              className="border border-gray-300 rounded-lg"
            />
            <button
              onClick={drawOnCanvas}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Draw Shapes
            </button>
          </div>
        </div>
      </div>

      {/* Video Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Volume2 size={20} />
          Video Controls
        </h3>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <video
              ref={videoRef}
              width="100%"
              height="200"
              className="bg-gray-100 rounded-lg"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='16'%3EVideo Placeholder%3C/text%3E%3C/svg%3E"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="flex gap-2">
              <button
                onClick={playVideo}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Play
              </button>
              <button
                onClick={pauseVideo}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Pause
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">DOM Element Access</h3>
          <CodeBlock code={domRefCode} title="Accessing DOM Elements" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Storing Mutable Values</h3>
          <CodeBlock code={valueRefCode} title="Persistent Values" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Custom Hooks with useRef</h3>
          <CodeBlock code={customHookCode} title="Reusable Patterns" />
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-green-900 mb-2">useRef Key Characteristics</h4>
        <div className="grid md:grid-cols-2 gap-6 text-green-800">
          <div>
            <h5 className="font-semibold mb-2">✅ Use useRef for:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Accessing DOM elements (focus, scroll, etc.)</li>
              <li>• Storing timer IDs for cleanup</li>
              <li>• Keeping track of previous values</li>
              <li>• Storing any mutable value that doesn't need re-renders</li>
              <li>• Integrating with third-party DOM libraries</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">🔑 Key Points:</h5>
            <ul className="space-y-1 text-sm">
              <li>• .current property is mutable</li>
              <li>• Changes don't trigger re-renders</li>
              <li>• Value persists across renders</li>
              <li>• Updates are synchronous</li>
              <li>• Don't read/write during rendering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseRefExample;