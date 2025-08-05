import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Dropdown, Menu } from 'antd';

import Button from 'components/core-ui/button/button';
import { useHeaderProps } from 'components/core/use-header-props';
import { handleErrorMineImg } from 'components/global/global';

import Back from 'assets/icons/back-arrow.svg?react';

import * as authHelper from '../../../auth/core/auth-helpers';


function Header() {
  const { title, back, editInfo, showUpdateButton } = useHeaderProps();
  const currentUser = authHelper.getUser();
  const navigate = useNavigate();

  // Menu for the Dropdown
  const menu = (
    <Menu>
      <Menu.Item key='settings' onClick={() => navigate('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Item key='logout'>
        <NavLink to='/logout'>
          <span>Logout</span>
        </NavLink>
      </Menu.Item>
    </Menu>
  );

  return (
    <section className='ps-72 flex text-secondary-600 font-barlow border-b-2 bg-white mb-7 fixed top-0 w-full max-w-screen-4xl z-20'>
      <div className='flex items-center justify-between w-full bg-white py-6 pe-6 z-40'>
        <div className='flex items-center gap-7 ps-12'>
          <div className='flex'>
            {back && (
              <Button variant='text' className='me-4' onClick={back}>
                <Back />
              </Button>
            )}
            <h2 className='text-2xl font-medium'>{title}</h2>
          </div>
          {editInfo && <div>Edit Information: {editInfo}</div>}
          {showUpdateButton && <Button variant='primary'>Update</Button>}
        </div>
        <div className='flex place-items-center gap-7 notification'>

          <div className='flex gap-8 items-center'>
            <div className='flex items-center gap-3'>
              <div className='text-end'>
                <p className='font-medium'>{currentUser?.name}</p>
                <p className='text-sm text-light-gray capitalize'>
                  {currentUser?.role === 'operations' ? 'Team Member' : currentUser?.role}
                </p>
              </div>

              <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
                <div className='bg-gray-200 font-semibold text-3xl rounded-full w-14 h-14 flex flex-centered cursor-pointer'>
                  {currentUser?.profilePicture ? (
                    <img
                      src={currentUser?.profilePicture}
                      alt=''
                      className='rounded-full object-cover w-full h-full'
                      onError={handleErrorMineImg}
                    />
                  ) : (
                    <span>{currentUser?.name?.charAt(0)}</span>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Header;
