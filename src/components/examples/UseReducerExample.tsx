import React, { useReducer } from 'react';
import CodeBlock from '../CodeBlock';
import { ShoppingCart, Plus, Minus, Trash2, RotateCcw } from 'lucide-react';

// Shopping cart reducer
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          items: newItems,
          total: calculateTotal(newItems)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Counter reducer for comparison
interface CounterState {
  count: number;
  step: number;
}

type CounterAction = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; payload: number };

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step };
    case 'DECREMENT':
      return { ...state, count: state.count - state.step };
    case 'RESET':
      return { ...state, count: 0 };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

const UseReducerExample: React.FC = () => {
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [counterState, counterDispatch] = useReducer(counterReducer, { count: 0, step: 1 });

  const products = [
    { id: 1, name: 'React Handbook', price: 29.99 },
    { id: 2, name: 'JavaScript Guide', price: 24.99 },
    { id: 3, name: 'TypeScript Course', price: 39.99 },
  ];

  const basicReducerCode = `const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step };
    case 'DECREMENT':
      return { ...state, count: state.count - state.step };
    case 'RESET':
      return { ...state, count: 0 };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });`;

  const complexReducerCode = `const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          items: newItems,
          total: calculateTotal(newItems)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    default:
      return state;
  }
};`;

  const usageCode = `// Dispatching actions
dispatch({ type: 'INCREMENT' });
dispatch({ type: 'SET_STEP', payload: 5 });
dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Book', price: 29.99 } });`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">useReducer Hook</h2>
        <p className="text-lg text-gray-600 mb-6">
          The useReducer hook is an alternative to useState for managing complex state logic. It's especially useful when you have multiple related state variables or when the next state depends on the previous one.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simple Counter Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Simple Counter with Step</h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-blue-600">{counterState.count}</div>
              <div className="text-sm text-gray-600">Step: {counterState.step}</div>
              
              <div className="space-y-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => counterDispatch({ type: 'DECREMENT' })}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => counterDispatch({ type: 'RESET' })}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => counterDispatch({ type: 'INCREMENT' })}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="flex justify-center gap-2">
                  {[1, 2, 5, 10].map(step => (
                    <button
                      key={step}
                      onClick={() => counterDispatch({ type: 'SET_STEP', payload: step })}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        counterState.step === step
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Step {step}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shopping Cart Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={20} />
            Shopping Cart
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              {/* Products */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Products</h4>
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">${product.price}</div>
                    </div>
                    <button
                      onClick={() => cartDispatch({ type: 'ADD_ITEM', payload: product })}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Items */}
              {cartState.items.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">Cart</h4>
                    <button
                      onClick={() => cartDispatch({ type: 'CLEAR_CART' })}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {cartState.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">${item.price} × {item.quantity}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cartDispatch({ 
                            type: 'UPDATE_QUANTITY', 
                            payload: { id: item.id, quantity: item.quantity - 1 }
                          })}
                          className="w-6 h-6 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => cartDispatch({ 
                            type: 'UPDATE_QUANTITY', 
                            payload: { id: item.id, quantity: item.quantity + 1 }
                          })}
                          className="w-6 h-6 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-right font-bold text-lg text-green-600">
                    Total: ${cartState.total.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Reducer Pattern</h3>
          <CodeBlock code={basicReducerCode} title="Simple Counter Reducer" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Complex State Management</h3>
          <CodeBlock code={complexReducerCode} title="Shopping Cart Reducer" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Dispatching Actions</h3>
          <CodeBlock code={usageCode} title="Using dispatch" />
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-indigo-900 mb-2">useReducer vs useState</h4>
        <div className="grid md:grid-cols-2 gap-6 text-indigo-800">
          <div>
            <h5 className="font-semibold mb-2 text-green-700">Use useReducer when:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Complex state logic with multiple sub-values</li>
              <li>• State transitions depend on previous state</li>
              <li>• You want predictable state updates</li>
              <li>• Multiple related state variables</li>
              <li>• State logic is getting complex</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-blue-700">Use useState when:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Simple state (strings, numbers, booleans)</li>
              <li>• Independent state variables</li>
              <li>• State updates are straightforward</li>
              <li>• No complex state transitions</li>
              <li>• Getting started with React hooks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseReducerExample;