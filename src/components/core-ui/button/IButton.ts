export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'default' | 'rounded';
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  className?: string;
}