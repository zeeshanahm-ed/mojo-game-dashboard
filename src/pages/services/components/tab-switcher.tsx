import Button from 'components/core-ui/button/button';
import * as authHelper from '../../../auth/core/auth-helpers';
import { USER_ROLES } from 'components/global/global';


function TabSwitcher({ selectedTab, onSelectTab, title }: any) {
  const currentUser = authHelper.getUser();
  const getButtonClass = (key: number) => {
    return `h-11 text-sm gap-3 px-3 transition font-medium text-lg justify-center ${
      selectedTab === key ? 'text-primary' : 'text-light-gray'
    }`;
  };

  const getBorderClass = (key: number) => {
    return `absolute bottom-[-3.5px] h-[6px] ${selectedTab === key ? 'bg-primary rounded-full w-[33.33%]' : ''}`;
  };

  return (
    <div className={`grid  ${currentUser?.role !== USER_ROLES.OPERATION ? 'grid-cols-3' : 'grid-cols-2'} relative text-center border-b border-border-gray`}>
      <div >
        <Button variant='text' className={`${getButtonClass(0)}`} onClick={() => onSelectTab(0)}>
          Details
        </Button>
        <div className={getBorderClass(0)} />
      </div>
      <div>
        <Button variant='text' className={`${getButtonClass(1)}`} onClick={() => onSelectTab(1)}>
          {title}
        </Button>
        <div className={getBorderClass(1)} />
      </div>
      {currentUser?.role !== USER_ROLES.OPERATION && (
        <div>
          <Button variant='text' className={`${getButtonClass(2)}`} onClick={() => onSelectTab(2)}>
            Billing
          </Button>
          <div className={getBorderClass(2)} />
        </div>
      )}
    </div>
  );
}

export default TabSwitcher;
