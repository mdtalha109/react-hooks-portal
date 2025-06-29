interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  hookId: string;
  questions: Question[];
}

export const quizzes: Quiz[] = [
  {
    hookId: 'useState',
    questions: [
      {
        id: 'useState-1',
        question: 'What does useState return?',
        options: [
          'A single state value',
          'An array with the current state and a setter function',
          'An object with state and setState properties',
          'A function to update state'
        ],
        correctAnswer: 1,
        explanation: 'useState returns an array with two elements: the current state value and a function to update it.'
      },
      {
        id: 'useState-2',
        question: 'When does a component re-render after calling setState?',
        options: [
          'Immediately when setState is called',
          'After the current function execution completes',
          'Only when the state value actually changes',
          'At the next browser paint'
        ],
        correctAnswer: 1,
        explanation: 'React batches state updates and re-renders the component after the current function execution completes.'
      },
      {
        id: 'useState-3',
        question: 'What happens if you pass a function to useState as initial state?',
        options: [
          'The function is called on every render',
          'The function is called only on the first render',
          'It causes an error',
          'The function itself becomes the initial state'
        ],
        correctAnswer: 1,
        explanation: 'When you pass a function to useState, it\'s called only once during the initial render to compute the initial state.'
      }
    ]
  },
  {
    hookId: 'useEffect',
    questions: [
      {
        id: 'useEffect-1',
        question: 'When does useEffect run if no dependency array is provided?',
        options: [
          'Only on component mount',
          'Only on component unmount',
          'After every render',
          'Never'
        ],
        correctAnswer: 2,
        explanation: 'Without a dependency array, useEffect runs after every render (both mount and updates).'
      },
      {
        id: 'useEffect-2',
        question: 'What does returning a function from useEffect do?',
        options: [
          'It runs before the next effect',
          'It runs on component unmount',
          'Both A and B',
          'It prevents the effect from running'
        ],
        correctAnswer: 2,
        explanation: 'The cleanup function returned from useEffect runs before the next effect and on component unmount.'
      },
      {
        id: 'useEffect-3',
        question: 'What happens when you pass an empty dependency array [] to useEffect?',
        options: [
          'The effect runs on every render',
          'The effect runs only once after the first render',
          'The effect never runs',
          'It causes an error'
        ],
        correctAnswer: 1,
        explanation: 'An empty dependency array means the effect has no dependencies, so it runs only once after the initial render.'
      }
    ]
  },
  {
    hookId: 'useContext',
    questions: [
      {
        id: 'useContext-1',
        question: 'What is the main benefit of using useContext?',
        options: [
          'It improves performance',
          'It avoids prop drilling',
          'It provides type safety',
          'It enables server-side rendering'
        ],
        correctAnswer: 1,
        explanation: 'useContext helps avoid prop drilling by allowing components to access context values directly without passing props through intermediate components.'
      },
      {
        id: 'useContext-2',
        question: 'What happens when a context value changes?',
        options: [
          'Only the Provider re-renders',
          'All components using that context re-render',
          'No components re-render',
          'Only child components re-render'
        ],
        correctAnswer: 1,
        explanation: 'When a context value changes, all components that consume that context will re-render.'
      },
      {
        id: 'useContext-3',
        question: 'What should you do if useContext returns undefined?',
        options: [
          'Ignore it and continue',
          'Check if the component is wrapped in the corresponding Provider',
          'Use a different hook',
          'Restart the application'
        ],
        correctAnswer: 1,
        explanation: 'If useContext returns undefined, it usually means the component is not wrapped in the corresponding Provider component.'
      }
    ]
  },
  {
    hookId: 'useReducer',
    questions: [
      {
        id: 'useReducer-1',
        question: 'When should you use useReducer instead of useState?',
        options: [
          'For simple boolean state',
          'For complex state logic with multiple sub-values',
          'For string values only',
          'Never, useState is always better'
        ],
        correctAnswer: 1,
        explanation: 'useReducer is preferable when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.'
      },
      {
        id: 'useReducer-2',
        question: 'What should a reducer function return?',
        options: [
          'The action object',
          'A new state object',
          'The previous state',
          'undefined'
        ],
        correctAnswer: 1,
        explanation: 'A reducer function should always return a new state object based on the current state and action.'
      },
      {
        id: 'useReducer-3',
        question: 'What is the second parameter of useReducer?',
        options: [
          'The reducer function',
          'The initial state',
          'The dispatch function',
          'The action object'
        ],
        correctAnswer: 1,
        explanation: 'The second parameter of useReducer is the initial state value.'
      }
    ]
  },
  {
    hookId: 'useCallback',
    questions: [
      {
        id: 'useCallback-1',
        question: 'What is the primary purpose of useCallback?',
        options: [
          'To cache expensive calculations',
          'To prevent unnecessary re-creation of functions',
          'To handle side effects',
          'To manage component state'
        ],
        correctAnswer: 1,
        explanation: 'useCallback prevents unnecessary re-creation of functions, which can help optimize performance by preventing unnecessary re-renders of child components.'
      },
      {
        id: 'useCallback-2',
        question: 'When does useCallback return a new function?',
        options: [
          'On every render',
          'Never',
          'When dependencies change',
          'Only on component mount'
        ],
        correctAnswer: 2,
        explanation: 'useCallback returns a new function only when one of its dependencies changes.'
      },
      {
        id: 'useCallback-3',
        question: 'What should you include in the dependency array of useCallback?',
        options: [
          'All variables used inside the callback',
          'Only state variables',
          'Only props',
          'Nothing, leave it empty'
        ],
        correctAnswer: 0,
        explanation: 'You should include all variables from component scope that are used inside the callback in the dependency array.'
      }
    ]
  },
  {
    hookId: 'useMemo',
    questions: [
      {
        id: 'useMemo-1',
        question: 'What does useMemo return?',
        options: [
          'A memoized function',
          'A memoized value',
          'A state variable',
          'An effect cleanup function'
        ],
        correctAnswer: 1,
        explanation: 'useMemo returns a memoized value that is only recalculated when its dependencies change.'
      },
      {
        id: 'useMemo-2',
        question: 'When should you use useMemo?',
        options: [
          'For every calculation',
          'For expensive calculations only',
          'For simple arithmetic',
          'Never, it\'s deprecated'
        ],
        correctAnswer: 1,
        explanation: 'useMemo should be used for expensive calculations that you want to avoid repeating on every render.'
      },
      {
        id: 'useMemo-3',
        question: 'What happens if you omit the dependency array in useMemo?',
        options: [
          'The value is calculated once',
          'The value is calculated on every render',
          'It causes an error',
          'The value is never calculated'
        ],
        correctAnswer: 1,
        explanation: 'Without a dependency array, useMemo will calculate the value on every render, defeating its purpose.'
      }
    ]
  },
  {
    hookId: 'useRef',
    questions: [
      {
        id: 'useRef-1',
        question: 'What are the two main use cases for useRef?',
        options: [
          'State management and side effects',
          'DOM access and storing mutable values',
          'Context and reducers',
          'Memoization and optimization'
        ],
        correctAnswer: 1,
        explanation: 'useRef is primarily used for accessing DOM elements and storing mutable values that persist across renders without causing re-renders.'
      },
      {
        id: 'useRef-2',
        question: 'Does changing the .current property of a ref trigger a re-render?',
        options: [
          'Yes, always',
          'No, never',
          'Only if the ref is attached to a DOM element',
          'Only in development mode'
        ],
        correctAnswer: 1,
        explanation: 'Changing the .current property of a ref does not trigger a re-render. This is what makes refs useful for storing mutable values.'
      },
      {
        id: 'useRef-3',
        question: 'When is the ref.current value updated when attached to a DOM element?',
        options: [
          'Before the component renders',
          'After the component renders',
          'During the component render',
          'Never automatically'
        ],
        correctAnswer: 1,
        explanation: 'When a ref is attached to a DOM element, React sets ref.current after the component renders and the DOM is updated.'
      }
    ]
  },
  {
    hookId: 'useLayoutEffect',
    questions: [
      {
        id: 'useLayoutEffect-1',
        question: 'How does useLayoutEffect differ from useEffect?',
        options: [
          'It runs before DOM mutations',
          'It runs synchronously after DOM mutations',
          'It runs asynchronously',
          'There is no difference'
        ],
        correctAnswer: 1,
        explanation: 'useLayoutEffect runs synchronously after all DOM mutations but before the browser paints, while useEffect runs asynchronously after the paint.'
      },
      {
        id: 'useLayoutEffect-2',
        question: 'When should you use useLayoutEffect?',
        options: [
          'For all side effects',
          'When you need to measure DOM elements or prevent visual flicker',
          'For data fetching',
          'Never, useEffect is always better'
        ],
        correctAnswer: 1,
        explanation: 'useLayoutEffect should be used when you need to measure DOM elements or make DOM mutations that prevent visual flicker.'
      },
      {
        id: 'useLayoutEffect-3',
        question: 'What is a potential downside of useLayoutEffect?',
        options: [
          'It doesn\'t work with cleanup functions',
          'It can block visual updates and hurt performance',
          'It can\'t access DOM elements',
          'It doesn\'t support dependency arrays'
        ],
        correctAnswer: 1,
        explanation: 'useLayoutEffect runs synchronously and can block visual updates, potentially hurting performance if overused.'
      }
    ]
  },
  {
    hookId: 'useTransition',
    questions: [
      {
        id: 'useTransition-1',
        question: 'What is the purpose of useTransition?',
        options: [
          'To animate components',
          'To mark state updates as non-urgent',
          'To handle CSS transitions',
          'To manage component lifecycle'
        ],
        correctAnswer: 1,
        explanation: 'useTransition allows you to mark state updates as non-urgent, letting React prioritize more urgent updates first.'
      },
      {
        id: 'useTransition-2',
        question: 'What does useTransition return?',
        options: [
          'A boolean indicating if transition is pending',
          'A function to start transitions',
          'An array with isPending boolean and startTransition function',
          'A promise that resolves when transition completes'
        ],
        correctAnswer: 2,
        explanation: 'useTransition returns an array with isPending (boolean) and startTransition (function) to manage non-urgent updates.'
      },
      {
        id: 'useTransition-3',
        question: 'When should you use useTransition?',
        options: [
          'For all state updates',
          'For urgent updates only',
          'For non-urgent updates that might cause lag',
          'Never, it\'s experimental'
        ],
        correctAnswer: 2,
        explanation: 'useTransition should be used for non-urgent updates that might cause the UI to lag, allowing React to prioritize more important updates.'
      }
    ]
  },
  {
    hookId: 'custom',
    questions: [
      {
        id: 'custom-1',
        question: 'What naming convention should custom hooks follow?',
        options: [
          'They should start with "hook"',
          'They should start with "use"',
          'They should end with "Hook"',
          'No specific naming convention'
        ],
        correctAnswer: 1,
        explanation: 'Custom hooks must start with "use" to follow React\'s naming convention and enable React\'s rules of hooks.'
      },
      {
        id: 'custom-2',
        question: 'Can custom hooks call other hooks?',
        options: [
          'No, never',
          'Yes, but only built-in hooks',
          'Yes, both built-in and other custom hooks',
          'Only in certain conditions'
        ],
        correctAnswer: 2,
        explanation: 'Custom hooks can call any other hooks, including built-in hooks and other custom hooks, following the same rules of hooks.'
      },
      {
        id: 'custom-3',
        question: 'What is the main advantage of custom hooks?',
        options: [
          'Better performance',
          'Reusable stateful logic',
          'Smaller bundle size',
          'Automatic error handling'
        ],
        correctAnswer: 1,
        explanation: 'The main advantage of custom hooks is that they allow you to extract and reuse stateful logic between components.'
      }
    ]
  }
];