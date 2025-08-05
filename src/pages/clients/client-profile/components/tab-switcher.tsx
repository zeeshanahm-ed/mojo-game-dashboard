import Button from 'components/core-ui/button/button';

function TabSwitcher({ selectedTab, onSelectTab }: any) {
  const getButtonClass = (key: number) => {
    return `h-11 text-sm gap-3 px-3 transition font-medium text-lg justify-center ${selectedTab === key ? 'text-primary' : 'text-light-gray'
      }`;
  };

  const getBorderClass = (key: number) => {
    return `absolute bottom-[-3.5px] h-[6px] ${selectedTab === key ? 'bg-primary rounded-full w-[50%]' : ''}`;
  };

  return (
    <div className='grid grid-cols-2 relative text-center border-b border-border-gray'>
      <div>
        <Button variant='text' className={`${getButtonClass(0)}`} onClick={() => onSelectTab(0)}>
          Client Information
        </Button>
        <div className={getBorderClass(0)} />
      </div>
      <div>
        <Button variant='text' className={`${getButtonClass(1)}`} onClick={() => onSelectTab(1)}>
          Services
        </Button>
        <div className={getBorderClass(1)} />
      </div>
    </div>
  );
}

export default TabSwitcher;