import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import SignIn from 'auth/sign-in';
import SignUp from 'auth/sign-up';

import ForgotPassword from './reset-password/forgot-password';
import ResetPassword from './reset-password/reset-password';
import Verification from './reset-password/verification';

// import ResetPassword from './reset-password/reset-password';
// import Verification from './reset-password/verification';

function AuthPage() {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='verification' element={<Verification />} />
        <Route path='reset-password' element={<ResetPassword />} />
        <Route path='*' element={<Navigate to='/auth/sign-in' />} />
      </Route>
    </Routes>
  );
}

export { AuthPage };
