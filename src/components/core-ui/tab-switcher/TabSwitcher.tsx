import Button from 'components/core-ui/button/button';

type Tab = {
    label: string;
    count?: number;
};

type TabSwitcherProps = {
    selectedTab: number;
    onSelectTab: (index: number) => void;
    tabs: Tab[];
};

function TabSwitcher({ selectedTab, onSelectTab, tabs, }: TabSwitcherProps) {

    return (
        <div className='flex justify-between relative text-center border-b border-border-gray'>
            {tabs.map((tab, index) => (
                <div key={index} className='flex-1 relative'>
                    <Button
                        variant='text'
                        className={`h-11 gap-3 px-3 transition font-medium text-lg relative justify-center ${selectedTab === index ? 'text-primary' : 'text-dark-gray'}`}
                        onClick={() => onSelectTab(index)}
                    >
                        {tab.label}
                    </Button>
                    <div className={`absolute bottom-[-3.5px] h-[6px] ${selectedTab === index ? 'bg-primary rounded-full w-full' : ''}`} />
                </div>
            ))}
        </div>
    );
}

export default TabSwitcher;
