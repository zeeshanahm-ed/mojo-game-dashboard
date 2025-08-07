import { Navigate, Route, Routes } from 'react-router-dom';

// import { useAuth } from 'auth';

import { USER_ROLES } from 'components/global/global';
import Layout from 'components/layout/layout';

import Dashboard from 'pages/dashboard/dashboard';

import Settings from 'pages/settings/settings';
import UserManagement from 'pages/user-management/user-management';

import ProtectedRoute from './protected-routes';
import QuestionsNCategories from 'pages/questionNCategory/QuestionsNCategories';

function PrivateRoutes() {
  // const { currentUser } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path='/'
          element={<Dashboard />}
        />

        {/* Protect User Management Route - Only accessible by Super Admin */}
        <Route
          path='user-management'
          element={
            <UserManagement />
          }
        />

        <Route path='settings' element={<Settings />} />
        <Route path='question-category' element={<QuestionsNCategories />} />

        {/* Catch all route */}
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
      <Route path='*' element={<Navigate to='/error/404' />} />
    </Routes>
  );
}

export { PrivateRoutes };
