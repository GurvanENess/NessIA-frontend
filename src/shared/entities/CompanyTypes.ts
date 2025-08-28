export interface Company {
  id: string;
  name: string;
  email?: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}
