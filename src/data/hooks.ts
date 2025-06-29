import { Hook } from '../types';

export const hooks: Hook[] = [
  {
    id: 'useState',
    name: 'useState',
    category: 'basic',
    description: 'Manage component state in functional components',
    icon: 'database',
    difficulty: 'beginner'
  },
  {
    id: 'useEffect',
    name: 'useEffect',
    category: 'basic',
    description: 'Perform side effects in functional components',
    icon: 'zap',
    difficulty: 'beginner'
  },
  {
    id: 'useContext',
    name: 'useContext',
    category: 'basic',
    description: 'Access React context values without prop drilling',
    icon: 'share-2',
    difficulty: 'intermediate'
  },
  {
    id: 'useReducer',
    name: 'useReducer',
    category: 'advanced',
    description: 'Manage complex state logic with reducer functions',
    icon: 'settings',
    difficulty: 'intermediate'
  },
  {
    id: 'useCallback',
    name: 'useCallback',
    category: 'advanced',
    description: 'Memoize callback functions for performance optimization',
    icon: 'cpu',
    difficulty: 'advanced'
  },
  {
    id: 'useMemo',
    name: 'useMemo',
    category: 'advanced',
    description: 'Memoize expensive calculations and prevent unnecessary re-renders',
    icon: 'brain',
    difficulty: 'advanced'
  },
  {
    id: 'useRef',
    name: 'useRef',
    category: 'basic',
    description: 'Access DOM elements and persist values across renders',
    icon: 'target',
    difficulty: 'intermediate'
  },
  {
    id: 'useImperativeHandle',
    name: 'useImperativeHandle',
    category: 'advanced',
    description: 'Customize the instance value exposed to parent components',
    icon: 'link',
    difficulty: 'advanced'
  },
  {
    id: 'useLayoutEffect',
    name: 'useLayoutEffect',
    category: 'advanced',
    description: 'Synchronous version of useEffect for DOM mutations',
    icon: 'layout',
    difficulty: 'advanced'
  },
  {
    id: 'useDebugValue',
    name: 'useDebugValue',
    category: 'advanced',
    description: 'Display custom labels for custom hooks in React DevTools',
    icon: 'bug',
    difficulty: 'advanced'
  },
  {
    id: 'useId',
    name: 'useId',
    category: 'basic',
    description: 'Generate unique IDs for accessibility attributes',
    icon: 'hash',
    difficulty: 'beginner'
  },
  {
    id: 'useDeferredValue',
    name: 'useDeferredValue',
    category: 'advanced',
    description: 'Defer updates to improve performance in React 18',
    icon: 'clock',
    difficulty: 'advanced'
  },
  {
    id: 'useTransition',
    name: 'useTransition',
    category: 'advanced',
    description: 'Mark state updates as non-urgent transitions',
    icon: 'arrow-right',
    difficulty: 'advanced'
  },
  {
    id: 'useSyncExternalStore',
    name: 'useSyncExternalStore',
    category: 'advanced',
    description: 'Subscribe to external data sources safely',
    icon: 'database',
    difficulty: 'advanced'
  },
  {
    id: 'useInsertionEffect',
    name: 'useInsertionEffect',
    category: 'advanced',
    description: 'Insert styles before DOM mutations for CSS-in-JS libraries',
    icon: 'palette',
    difficulty: 'advanced'
  },
  {
    id: 'custom',
    name: 'Custom Hooks',
    category: 'custom',
    description: 'Create reusable stateful logic with custom hooks',
    icon: 'wrench',
    difficulty: 'advanced'
  }
];