import React, { useState, useMemo } from 'react';
import CodeBlock from '../CodeBlock';
import { Calculator, Filter, TrendingUp, Clock } from 'lucide-react';

// Expensive calculation function
const expensiveCalculation = (num: number): number => {
  console.log('Performing expensive calculation...');
  let result = 0;
  for (let i = 0; i < num * 1000000; i++) {
    result += i;
  }
  return result;
};

// Fibonacci calculation
const fibonacci = (n: number): number => {
  console.log(`Calculating fibonacci(${n})`);
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// Memoized fibonacci
const memoizedFibonacci = (() => {
  const cache = new Map<number, number>();
  
  return (n: number): number => {
    if (cache.has(n)) {
      console.log(`Fibonacci(${n}) from cache`);
      return cache.get(n)!;
    }
    
    console.log(`Calculating fibonacci(${n})`);
    let result: number;
    if (n <= 1) {
      result = n;
    } else {
      result = memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
    }
    
    cache.set(n, result);
    return result;
  };
})();

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
}

const UseMemoExample: React.FC = () => {
  const [count, setCount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [fibNumber, setFibNumber] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [category, setCategory] = useState('all');

  // Sample products data
  const products: Product[] = useMemo(() => [
    { id: 1, name: 'Laptop Pro', price: 1299, category: 'electronics', rating: 4.8 },
    { id: 2, name: 'Wireless Mouse', price: 29, category: 'electronics', rating: 4.2 },
    { id: 3, name: 'Coffee Mug', price: 15, category: 'home', rating: 4.5 },
    { id: 4, name: 'Desk Chair', price: 199, category: 'furniture', rating: 4.1 },
    { id: 5, name: 'Smartphone', price: 699, category: 'electronics', rating: 4.6 },
    { id: 6, name: 'Table Lamp', price: 45, category: 'home', rating: 4.3 },
    { id: 7, name: 'Bookshelf', price: 89, category: 'furniture', rating: 4.0 },
    { id: 8, name: 'Headphones', price: 149, category: 'electronics', rating: 4.7 },
  ], []);

  // Expensive calculation with useMemo
  const expensiveResult = useMemo(() => {
    return expensiveCalculation(count);
  }, [count]);

  // Fibonacci calculation with useMemo
  const fibResult = useMemo(() => {
    return memoizedFibonacci(fibNumber);
  }, [fibNumber]);

  // Complex filtering and sorting with useMemo
  const filteredAndSortedProducts = useMemo(() => {
    console.log('Filtering and sorting products...');
    
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, category]);

  // Statistics calculation with useMemo
  const productStats = useMemo(() => {
    console.log('Calculating product statistics...');
    
    const totalProducts = filteredAndSortedProducts.length;
    const averagePrice = totalProducts > 0 
      ? filteredAndSortedProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts 
      : 0;
    const averageRating = totalProducts > 0
      ? filteredAndSortedProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts
      : 0;
    const priceRange = totalProducts > 0 
      ? {
          min: Math.min(...filteredAndSortedProducts.map(p => p.price)),
          max: Math.max(...filteredAndSortedProducts.map(p => p.price))
        }
      : { min: 0, max: 0 };

    return {
      totalProducts,
      averagePrice,
      averageRating,
      priceRange
    };
  }, [filteredAndSortedProducts]);

  const basicMemoCode = `// Without useMemo - calculated every render
const expensiveResult = expensiveCalculation(count);

// With useMemo - only recalculated when count changes
const expensiveResult = useMemo(() => {
  return expensiveCalculation(count);
}, [count]);

// The calculation only runs when dependencies change
console.log('Result:', expensiveResult);`;

  const complexMemoCode = `// Complex filtering and sorting with useMemo
const filteredAndSortedProducts = useMemo(() => {
  console.log('Filtering and sorting products...');
  
  let filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'price': return a.price - b.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  return filtered;
}, [products, searchTerm, sortBy, category]);`;

  const objectMemoCode = `// Memoizing object creation
const config = useMemo(() => ({
  apiUrl: process.env.REACT_APP_API_URL,
  timeout: 5000,
  retries: 3
}), []); // Empty deps = object never recreated

// Memoizing computed statistics
const stats = useMemo(() => {
  return {
    total: items.length,
    average: items.reduce((sum, item) => sum + item.value, 0) / items.length,
    max: Math.max(...items.map(item => item.value))
  };
}, [items]);`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">useMemo Hook</h2>
        <p className="text-lg text-gray-600 mb-6">
          The useMemo hook returns a memoized value. It's used to optimize performance by avoiding expensive calculations on every render when dependencies haven't changed.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Expensive Calculation Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Calculator size={20} />
            Expensive Calculation
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Count (affects calculation):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCount(Math.max(1, count - 1))}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 rounded font-mono">{count}</span>
                  <button
                    onClick={() => setCount(count + 1)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiplier (doesn't affect calculation):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMultiplier(Math.max(1, multiplier - 1))}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 rounded font-mono">{multiplier}</span>
                  <button
                    onClick={() => setMultiplier(multiplier + 1)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800 mb-2">
                  Expensive Result: <span className="font-mono font-bold">{expensiveResult.toLocaleString()}</span>
                </div>
                <div className="text-xs text-blue-600">
                  Check console - calculation only runs when count changes!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fibonacci Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} />
            Fibonacci Calculator
          </h3>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fibonacci Number (n):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFibNumber(Math.max(0, fibNumber - 1))}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 rounded font-mono">{fibNumber}</span>
                  <button
                    onClick={() => setFibNumber(Math.min(40, fibNumber + 1))}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Max: 40 (to prevent browser freeze)
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800 mb-2">
                  Fibonacci({fibNumber}) = <span className="font-mono font-bold">{fibResult.toLocaleString()}</span>
                </div>
                <div className="text-xs text-green-600">
                  Uses memoization for efficient calculation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Filtering Example */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Filter size={20} />
          Product Filtering & Sorting
        </h3>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{productStats.totalProducts}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${productStats.averagePrice.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Avg Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{productStats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                ${productStats.priceRange.min} - ${productStats.priceRange.max}
              </div>
              <div className="text-sm text-gray-600">Price Range</div>
            </div>
          </div>

          {/* Products List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedProducts.map(product => (
              <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <div className="text-sm text-gray-600 capitalize">{product.category}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-green-600">${product.price}</span>
                  <span className="text-sm text-yellow-600">★ {product.rating}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            Check console to see when filtering/sorting calculations run
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic useMemo Pattern</h3>
          <CodeBlock code={basicMemoCode} title="Memoizing Expensive Calculations" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Complex Data Processing</h3>
          <CodeBlock code={complexMemoCode} title="Filtering and Sorting" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Object Memoization</h3>
          <CodeBlock code={objectMemoCode} title="Memoizing Objects and Statistics" />
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-900 mb-2">useMemo Best Practices</h4>
        <div className="grid md:grid-cols-2 gap-6 text-purple-800">
          <div>
            <h5 className="font-semibold mb-2 text-green-700">✅ Use useMemo for:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Expensive calculations (loops, complex math)</li>
              <li>• Filtering/sorting large datasets</li>
              <li>• Creating objects/arrays as dependencies</li>
              <li>• Preventing child component re-renders</li>
              <li>• Complex derived state</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2 text-red-700">❌ Don't use for:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Simple calculations (addition, string concat)</li>
              <li>• Values that change frequently</li>
              <li>• When dependencies are unstable</li>
              <li>• Premature optimization</li>
              <li>• Every computed value</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseMemoExample;