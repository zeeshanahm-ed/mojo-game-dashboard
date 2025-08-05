import { forwardRef } from 'react';

import twc from 'tw-classnames';

import { IButtonProps } from './IButton';

const classNames = {
  primary: 'text-white bg-primary px-10 py-3 font-medium transition',
  secondary: 'text-white bg-secondary py-4 px-10 font-medium tracking-wider transition ',
  text: '',
  default: 'font-secondary px-10 py-4 text-secondary border font-medium border-secondary bg-white',
  rounded: 'rounded-full w-18 h-18 bg-gray-150 flex-centered',
};

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ variant = 'primary', suffixElement, prefixElement, className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type='button'
        className={twc(
          'inline-flex items-center gap-6 rounded-md transition hover:opacity-85',
          classNames[variant],
          className
        )}
        {...rest}
      >
        {prefixElement}
        {children}
        {suffixElement}
      </button>
    );
  }
);

export default Button;
