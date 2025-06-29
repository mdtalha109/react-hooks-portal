import React, { createContext, useContext, useState, useReducer } from 'react';
import CodeBlock from '../CodeBlock';
import { Sun, Moon, User, Settings, Globe, Palette, Bell, Shield, ChevronDown, Check } from 'lucide-react';

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// User Context with more complex state
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  preferences: {
    language: string;
    notifications: boolean;
    privacy: 'public' | 'private';
  };
}

interface UserContextType {
  user: User | null;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const UserContext = createContext<UserContextType | null>(null);

// Shopping Cart Context with useReducer
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
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
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
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
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

// Custom hooks for better DX
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Theme Provider
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('light');
  
  const toggleTheme = () => {
    setThemeState(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'auto';
        case 'auto': return 'light';
        default: return 'light';
      }
    });
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// User Provider
const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setUser(newUser);
  };
  
  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    setUser(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    } : null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};

// Cart Provider
const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Header Component
const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const { state: cartState } = useCart();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={18} />;
      case 'dark': return <Moon size={18} />;
      case 'auto': return <Settings size={18} />;
    }
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'light': return 'bg-white border-slate-200 text-slate-900';
      case 'dark': return 'bg-slate-800 border-slate-600 text-white';
      case 'auto': return 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-slate-900';
    }
  };

  return (
    <div className={`p-6 rounded-2xl border-2 ${getThemeColors()} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Settings className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">React Context Demo</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Multi-context application
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Cart Badge */}
          <div className="relative">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <span className="text-emerald-700 font-semibold">🛒</span>
            </div>
            {cartState.itemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {cartState.itemCount}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-slate-700 hover:bg-slate-600' 
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
          </button>
          
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User size={18} className="text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">{user.name}</div>
                <div className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {user.role}
                </div>
              </div>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm: React.FC = () => {
  const { login } = useUser();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'moderator',
    preferences: {
      language: 'en',
      notifications: true,
      privacy: 'public' as 'public' | 'private'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      login(formData);
    }
  };

  const inputClasses = `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
    theme === 'dark' 
      ? 'bg-slate-700 border-slate-600 text-white' 
      : 'bg-white border-slate-300 text-slate-900'
  }`;

  return (
    <div className={`p-8 rounded-2xl border ${
      theme === 'dark' 
        ? 'bg-slate-800 border-slate-600' 
        : 'bg-white border-slate-200'
    }`}>
      <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
        Login to Continue
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className={inputClasses}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              className={inputClasses}
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
              className={inputClasses}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Language
            </label>
            <select
              value={formData.preferences.language}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                preferences: { ...prev.preferences, language: e.target.value }
              }))}
              className={inputClasses}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Privacy
            </label>
            <select
              value={formData.preferences.privacy}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                preferences: { ...prev.preferences, privacy: e.target.value as any }
              }))}
              className={inputClasses}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="notifications"
            checked={formData.preferences.notifications}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              preferences: { ...prev.preferences, notifications: e.target.checked }
            }))}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="notifications" className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            Enable notifications
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

// User Profile Component
const UserProfile: React.FC = () => {
  const { user, updateUser, updatePreferences } = useUser();
  const { theme } = useTheme();

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className={`p-8 rounded-2xl border ${
      theme === 'dark' 
        ? 'bg-slate-800 border-slate-600' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <User className="text-white" size={32} />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            User Profile
          </h3>
          <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Manage your account settings
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Name
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser({ name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateUser({ email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Role
            </label>
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-lg border ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Preferences
          </h4>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Language
            </label>
            <select
              value={user.preferences.language}
              onChange={(e) => updatePreferences({ language: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Privacy
            </label>
            <select
              value={user.preferences.privacy}
              onChange={(e) => updatePreferences({ privacy: e.target.value as any })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="profile-notifications"
              checked={user.preferences.notifications}
              onChange={(e) => updatePreferences({ notifications: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="profile-notifications" className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Enable notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shopping Cart Component
const ShoppingCart: React.FC = () => {
  const { state, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { theme } = useTheme();

  const products = [
    { id: '1', name: 'React Handbook', price: 29.99 },
    { id: '2', name: 'JavaScript Guide', price: 24.99 },
    { id: '3', name: 'TypeScript Course', price: 39.99 },
    { id: '4', name: 'Node.js Masterclass', price: 49.99 },
  ];

  return (
    <div className={`p-8 rounded-2xl border ${
      theme === 'dark' 
        ? 'bg-slate-800 border-slate-600' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <span className="text-white text-xl">🛒</span>
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Shopping Cart
            </h3>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {state.itemCount} items • ${state.total.toFixed(2)}
            </p>
          </div>
        </div>
        
        {state.items.length > 0 && (
          <button
            onClick={clearCart}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Available Products
          </h4>
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-slate-600' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {product.name}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    ${product.price}
                  </div>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Cart Items
          </h4>
          {state.items.length === 0 ? (
            <div className={`text-center p-8 rounded-xl border-2 border-dashed ${
              theme === 'dark' 
                ? 'border-slate-600 text-slate-400' 
                : 'border-slate-300 text-slate-500'
            }`}>
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-3">
              {state.items.map(item => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-slate-700 border-slate-600' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex-1">
                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {item.name}
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className={`w-8 text-center font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              
              <div className={`p-4 rounded-xl border-2 ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-emerald-600' 
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className={`text-lg font-bold text-center ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'
                }`}>
                  Total: ${state.total.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Demo Component
const ContextDemo: React.FC = () => {
  const { user } = useUser();
  
  return (
    <div className="space-y-8">
      <Header />
      
      {!user ? (
        <LoginForm />
      ) : (
        <div className="space-y-8">
          <UserProfile />
          <ShoppingCart />
        </div>
      )}
    </div>
  );
};

const UseContextExample: React.FC = () => {
  const contextCreationCode = `// 1. Create Context with TypeScript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. Create Provider Component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('light');
  
  const toggleTheme = () => {
    setThemeState(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'auto';
        case 'auto': return 'light';
        default: return 'light';
      }
    });
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};`;

  const customHookCode = `// 3. Create Custom Hook for Better DX
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 4. Use in Components
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
};`;

  const multipleContextsCode = `// Multiple Context Providers
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Router>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

// Consuming Multiple Contexts
const Dashboard = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { state: cartState } = useCart();
  
  return (
    <div className={theme}>
      <h1>Welcome, {user?.name}!</h1>
      <p>Cart items: {cartState.itemCount}</p>
    </div>
  );
};`;

  const contextWithReducerCode = `// Context with useReducer for Complex State
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Complex state logic here
      return newState;
    case 'REMOVE_ITEM':
      // Remove item logic
      return newState;
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  
  return (
    <CartContext.Provider value={{ state, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};`;

  const performanceOptimizationCode = `// Performance Optimization Techniques

// 1. Split contexts to minimize re-renders
const ThemeContext = createContext();
const UserContext = createContext();
const CartContext = createContext();

// 2. Memoize context values
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  // Memoize the context value
  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* Complex UI */}</div>;
});

// 4. Selective context consumption
const useThemeOnly = () => {
  const { theme } = useContext(AppContext);
  return theme; // Only subscribe to theme changes
};`;

  const bestPracticesCode = `// Context Best Practices

// 1. Provide default values
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

// 2. Create compound providers for related contexts
const AppProviders = ({ children }) => (
  <ThemeProvider>
    <UserProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </UserProvider>
  </ThemeProvider>
);

// 3. Use context for truly global state
// ✅ Good: Theme, user auth, language
// ❌ Avoid: Form state, temporary UI state

// 4. Keep context values stable
const Provider = ({ children }) => {
  const [state, setState] = useState(initialState);
  
  // ❌ Bad: Creates new object every render
  const badValue = {
    state,
    setState,
    helper: () => {}
  };
  
  // ✅ Good: Memoized value
  const goodValue = useMemo(() => ({
    state,
    setState,
    helper: () => {}
  }), [state]);
  
  return (
    <Context.Provider value={goodValue}>
      {children}
    </Context.Provider>
  );
};`;

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div>
        <h2 className="text-4xl font-bold text-slate-900 mb-6">useContext Hook - Complete Guide</h2>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">What is useContext?</h3>
          <p className="text-lg text-emerald-800 leading-relaxed mb-4">
            useContext provides a way to pass data through the component tree without having to pass props down manually at every level. 
            It's perfect for global state like themes, user authentication, language preferences, and shopping carts.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-emerald-200">
              <div className="text-emerald-600 font-semibold mb-2">Context Creation</div>
              <div className="text-sm text-emerald-700">Create context with createContext()</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200">
              <div className="text-emerald-600 font-semibold mb-2">Provider Component</div>
              <div className="text-sm text-emerald-700">Wrap components to provide values</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200">
              <div className="text-emerald-600 font-semibold mb-2">Consumer Hook</div>
              <div className="text-sm text-emerald-700">Use useContext to consume values</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">Interactive Multi-Context Demo</h3>
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <ThemeProvider>
            <UserProvider>
              <CartProvider>
                <ContextDemo />
              </CartProvider>
            </UserProvider>
          </ThemeProvider>
        </div>
        <div className="text-sm text-slate-600 bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <strong>Demo Features:</strong> This demo showcases three different contexts working together - 
          Theme context for UI theming, User context for authentication state, and Cart context with useReducer for complex state management.
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-8">
        <h3 className="text-3xl font-bold text-slate-800">Implementation Patterns</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">1. Context Creation & Provider</h4>
            <CodeBlock code={contextCreationCode} title="Basic Context Setup" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">2. Custom Hooks for Better DX</h4>
            <CodeBlock code={customHookCode} title="Custom Context Hooks" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">3. Multiple Context Providers</h4>
            <CodeBlock code={multipleContextsCode} title="Composing Multiple Contexts" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">4. Context with useReducer</h4>
            <CodeBlock code={contextWithReducerCode} title="Complex State Management" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">5. Performance Optimization</h4>
            <CodeBlock code={performanceOptimizationCode} title="Optimizing Context Performance" />
          </div>

          <div>
            <h4 className="text-xl font-semibold text-slate-800 mb-4">6. Best Practices</h4>
            <CodeBlock code={bestPracticesCode} title="Context Best Practices" />
          </div>
        </div>
      </div>

      {/* Best Practices Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">useContext Best Practices & Guidelines</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <Check size={20} />
              Best Practices
            </h4>
            <ul className="space-y-3 text-emerald-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Create separate contexts for different concerns (theme, user, cart)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Always provide default values for contexts</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use custom hooks to wrap useContext for better error handling</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Memoize context values to prevent unnecessary re-renders</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use TypeScript for better type safety and developer experience</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <ChevronDown size={20} />
              Common Pitfalls
            </h4>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Overusing context for all state (use for truly global state only)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Creating new objects in render without memoization</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Putting too much unrelated state in a single context</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Not handling the case when context is used outside provider</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Using context for frequently changing values without optimization</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">When to Use Context</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-emerald-800 mb-2">✅ Perfect For</div>
              <div className="text-emerald-700">Theme, user auth, language, global settings</div>
            </div>
            <div>
              <div className="font-medium text-amber-800 mb-2">⚠️ Consider Carefully</div>
              <div className="text-amber-700">Shopping cart, notifications, modal state</div>
            </div>
            <div>
              <div className="font-medium text-red-800 mb-2">❌ Avoid For</div>
              <div className="text-red-700">Form state, temporary UI state, frequently changing data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseContextExample;