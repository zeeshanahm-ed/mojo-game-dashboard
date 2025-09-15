import { NavLink, useNavigate } from 'react-router-dom';
import twc from 'tw-classnames';
import Button from 'components/core-ui/button/button';
//icons
import Logout from 'assets/icons/logout-icon.svg?react';

// Helpers
import useGetCategoriesForDropDown from 'pages/questionNCategory/categories/core/hooks/useGetCategoriesForDropDown';
import { useGetAllCategoriesDataForDropDownFromStore } from 'store/AllCategoriesData';
import { useEffect, useState } from 'react';
import LogoutModal from 'auth/logout-modal';
import useGetAllUsersDataForDropDown from 'pages/user-management/core/hooks/useGetAllUsersDataForDropDown';
import { useGetAllUsersDataForDropDownFromStore } from 'store/AllUsersData';
import { ROLES } from 'utils/Enums';



function SidebarRoutes() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);


  const { allCategoriesData } = useGetCategoriesForDropDown();
  const { allUsersData } = useGetAllUsersDataForDropDown();
  const { setCategoriesData } = useGetAllCategoriesDataForDropDownFromStore();
  const { setUsersData } = useGetAllUsersDataForDropDownFromStore();

  useEffect(() => {
    if (allCategoriesData) {
      setCategoriesData(allCategoriesData);
    }
    if (allUsersData) {
      setUsersData(allUsersData);
    }
  }, [allCategoriesData, allUsersData]);


  // Define the routes along with the roles that can access them
  const routes = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/',
      roles: [ROLES.CONTENT_MANAGER, ROLES.SUPER_ADMIN, ROLES.READ_ONLY, ROLES.FINANCE_MANAGER],
    },
    {
      key: 'user-management',
      label: 'User Management',
      path: '/user-management',
      roles: [ROLES.CONTENT_MANAGER, ROLES.SUPER_ADMIN, ROLES.READ_ONLY, ROLES.FINANCE_MANAGER],
    },
    {
      key: 'question-category',
      label: 'Question/category',
      path: '/question-category',
      roles: [ROLES.CONTENT_MANAGER, ROLES.SUPER_ADMIN, ROLES.READ_ONLY, ROLES.FINANCE_MANAGER],
    },
    {
      key: 'settings-controls',
      label: 'Settings & Controls',
      path: '/settings',
      roles: [ROLES.CONTENT_MANAGER, ROLES.SUPER_ADMIN, ROLES.READ_ONLY, ROLES.FINANCE_MANAGER],
    },
    {
      key: 'roles-permissions',
      label: 'Roles & Permissions',
      path: '/roles-permissions',
      roles: [ROLES.CONTENT_MANAGER, ROLES.SUPER_ADMIN, ROLES.READ_ONLY, ROLES.FINANCE_MANAGER],
    },
    {
      key: 'subscription',
      label: 'Subscription',
      path: '/subscription',
      roles: [ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER],
    },
    {
      key: 'reviewers',
      label: 'Reviewers',
      path: '/reviewers',
      roles: [ROLES.SUPER_ADMIN, ROLES.MODERATOR],
    },
    {
      key: 'reviewed-questions',
      label: 'Reviewed Questions',
      path: '/reviewed-questions',
      roles: [ROLES.SUPER_ADMIN, ROLES.MODERATOR],
    },
    {
      key: 'live-questions',
      label: 'Live Questions',
      path: '/live-questions',
      roles: [ROLES.SUPER_ADMIN, ROLES.MODERATOR],
    },
  ];


  const filteredRoutes = routes.filter((route) =>
    currentUser?.role && route.roles.includes(currentUser.role)
  );

  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate('/');
  };

  return (
    <section className='fixed top-0 font-primary z-[999] font-medium flex flex-col h-screen border-r w-72'>
      <div className='flex flex-col h-screen'>
        <div className='flex items-center justify-center'>
          <Button
            className='gap-0 my-6 justify-center items-end rounded-none'
            variant='text'
            onClick={navigateToDashboard}
          >
            <div className="flex">
              <h1 className="text-5xl font-bold font-secondary">MOJO</h1>
              <h2 className="text-base font-medium mt-5 ml-2">Admin Portal</h2>
            </div>
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
                    <div className={twc('relative w-[100%] flex items-center my-3 justify-start gap-4  font-normal text-lg')} >
                      <span>{label}</span>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button onClick={() => setLogoutModalOpen(true)} className={'flex-1 flex text-lg items-center justify-start gap-4 py-4 ps-4 font-medium rounded-s-md'}>
          <span className='w-8'>
            <Logout className='mx-auto' />
          </span>
          <span>Logout</span>
        </button>
      </div>
      <LogoutModal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} />
    </section>
  );
}

export default SidebarRoutes;
