import { NavLink, useNavigate } from 'react-router-dom';
import twc from 'tw-classnames';
import Button from 'components/core-ui/button/button';
//icons
import Logout from 'assets/icons/logout-icon.svg?react';
import LogoText from 'assets/icons/sidebar-logo-text.png';
import Logo from 'assets/icons/sidebar-logo.png';
// Helpers
import * as authHelper from '../../../auth/core/auth-helpers';
import { handleErrorMineImg, USER_ROLES } from 'components/global/global';



function SidebarRoutes() {
  const currentUser = authHelper.getUser();

  // Define the routes along with the roles that can access them
  const routes = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/',
      roles: true,
    },
    {
      key: 'user-management',
      label: 'User Management',
      path: '/user-management',
      roles: true,
    },
    {
      key: 'question-category',
      label: 'Question/category',
      path: '/question-category',
      roles: true,
    },
    {
      key: 'review-requests',
      label: 'Review Requests',
      path: '/review-requests',
      roles: true,
    },
    {
      key: 'game-packs-pricing',
      label: 'Game packs & pricing',
      path: '/game-packs-pricing',
      roles: true,
    },
    {
      key: 'payment-transactions',
      label: 'Payment & Transactions',
      path: '/payment-transactions',
      roles: true,
    },
    {
      key: 'promo-code-management',
      label: 'Promo code Management',
      path: '/promo-code-management',
      roles: true,
    },
    {
      key: 'settings-controls',
      label: 'Settings & Controls',
      path: '/settings-controls',
      roles: true,
    },
    {
      key: 'roles-permissions',
      label: 'Roles & Permissions',
      path: '/roles-permissions',
      roles: true,
    },
  ];


  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate('/');
  };


  const filteredRoutes = routes.filter((route) => route.roles === true);

  return (
    <section className='fixed top-0 font-primary z-[999] font-medium flex flex-col h-screen border-r w-72'>
      <div className='flex flex-col h-screen'>
        <div className='flex items-center justify-center border-b-2'>
          <Button
            className='gap-0 my-6 justify-center items-end border-gray-300 rounded-none'
            variant='text'
            onClick={navigateToDashboard}
          >
            <img src={Logo} alt='logo' onError={handleErrorMineImg} />
            <img src={LogoText} alt='logo' onError={handleErrorMineImg} />
          </Button>
        </div>
        <div className='overflow-auto h-screen'>
          <div className='flex flex-col text-start'>
            <ul>
              {filteredRoutes.map(({ key, label, path }) => (
                <li key={key}>
                  <NavLink
                    className={({ isActive }) =>
                      twc(
                        'flex items-center border-b gap-5 py-2 ps-4',
                        isActive
                          ? '[&>span]:visible [&>div]:text-primary [&>div>span>svg:nth-child(1)]:hidden'
                          : '[&>span]:invisible [&>div]:bg-none [&>div]:text-black [&>div>span>svg:nth-child(2)]:hidden'
                      )
                    }
                    to={path}
                  >
                    <span className='inline-block bg-primary w-3 h-3 rounded-full' />
                    <div className={twc('relative w-[100%] flex items-center my-4 justify-start gap-4  font-normal text-lg')} >
                      <span>{label}</span>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='border-t pb-4'>
          <NavLink
            className={({ isActive }) =>
              twc('flex gap-4 items-center transition', isActive ? '[&>span]:visible' : '[&>span]:invisible')
            }
            to='/logout'
          >
            <div className={twc('flex-1 flex items-center justify-start gap-4 py-4 ps-4 font-medium rounded-s-md')}>
              <span className='w-8'>
                <Logout className='mx-auto' />
              </span>
              <span>Logout</span>
            </div>
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default SidebarRoutes;
