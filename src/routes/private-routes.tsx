import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { useAuth } from 'auth';

import { USER_ROLES } from 'components/global/global';
import Layout from 'components/layout/layout';

import AnalyticsWrapper from 'pages/analytics/analyticWraper';
import Billing from 'pages/billing/billing';
import AddClient from 'pages/clients/add-client/add-client';
import ClientProfile from 'pages/clients/client-profile/client-profile';
import Clients from 'pages/clients/clients';
import Dashboard from 'pages/dashboard/dashboard';
import IndividualJobPlacement from 'pages/services/individual-job-placement/individual-job-placement';
import Services from 'pages/services/services';
import Settings from 'pages/settings/settings';
import Templates from 'pages/templates/templates';
import UserManagement from 'pages/user-management/user-management';
import Notification from 'pages/notification/Notification';
import AlertsNWarnings from 'pages/alertsNWarnings/AlertsNWarnings';

import ProtectedRoute from './protected-routes';
import Leads from 'pages/leads/Leads';
import LeadDetails from 'pages/leads/leadDetails/LeadDetails';

function PrivateRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path='/'
          element={USER_ROLES.OPERATION === currentUser?.data?.user?.role ? <Clients /> : <Dashboard />}
        />

        <Route path='clients' element={<Outlet />}>
          <Route path='leads' element={<Leads />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/clients/add-client' element={<AddClient />} />
          <Route path='/clients/profile/:clientId' element={<ClientProfile />} />
        </Route>

        <Route path="leads" element={<Outlet />}>
          <Route index element={<Leads />} />
          <Route path="lead-details/:leadId" element={<LeadDetails />} />
        </Route>


        <Route path='services' element={<Outlet />}>
          <Route index element={<Services />} />
          <Route path='service-detail/:serviceId' element={<IndividualJobPlacement />} />
        </Route>

        {/* Protect Analytics Route - Only accessible by Super Admin and Billing */}
        <Route
          path='analytics'
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.BILLING]}>
              <AnalyticsWrapper />
            </ProtectedRoute>
          }
        />

        {/* Protect Billing Route - Only accessible by Super Admin and Billing */}
        <Route
          path='billing'
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.BILLING]}>
              <Billing />
            </ProtectedRoute>
          }
        />

        {/* Protect User Management Route - Only accessible by Super Admin */}
        <Route
          path='user-management'
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route path='templates' element={<Templates />} />
        <Route path='settings' element={<Settings />} />
        <Route path='notification' element={<Notification />} />
        <Route path='alerts-warnings' element={<AlertsNWarnings />} />

        {/* Catch all route */}
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
      <Route path='*' element={<Navigate to='/error/404' />} />
    </Routes>
  );
}

export { PrivateRoutes };
