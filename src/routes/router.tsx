import { useMemo } from 'react';
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { AuthPage, useAuth } from 'auth';
import { SignOut } from 'auth/sign-out';

import ErrorBoundary from 'routes/error-boundary';

import { PrivateRoutes } from './private-routes';
import WithSuspense from './with-suspense';

function AppRoutes() {
  const { currentUser } = useAuth();

  const router = useMemo(() => {
    return createBrowserRouter(
      createRoutesFromElements(
        <Route errorElement={<ErrorBoundary />}>
          <Route path='logout' element={<SignOut />} />

          {currentUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route path='auth/*' element={<Navigate to='/' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}

          <Route path='*' element={<Navigate to='/error/404' />} />
        </Route>
      )
    );
  }, [currentUser]);

  return (
    <WithSuspense>
      <RouterProvider router={router} />
    </WithSuspense>
  );
}

export default AppRoutes;
