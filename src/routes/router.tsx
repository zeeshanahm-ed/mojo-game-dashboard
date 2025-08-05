import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { AuthPage, SignOut, useAuth } from 'auth';

import ErrorBoundary from 'routes/error-boundary';

import { PrivateRoutes } from './private-routes';
import WithSuspense from './with-suspense';
import { useMemo } from 'react';

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
