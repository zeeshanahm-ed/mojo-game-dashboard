interface Props {
  children: React.ReactNode;
}

function Container({ children }: Props) {
  return <div className='mx-auto max-w-screen-4xl'>{children}</div>;
}

export default Container;
