export interface Hook {
  id: string;
  name: string;
  category: 'basic' | 'advanced' | 'custom';
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
  component: React.ComponentType;
  explanation: string;
}