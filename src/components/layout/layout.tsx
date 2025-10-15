import { Outlet } from 'react-router-dom';

import Container from 'components/core-ui/container/container';
import { HeaderPropsProvider } from 'components/core/use-header-props';

import ScrollToTop from 'helpers/scroll-to-top';

// import WithSuspense from 'routes/with-suspense';

import Header from './components/header';
import SidebarRoutes from './components/sidebar-routes';

function Layout() {
  return (
    <Container>
      <HeaderPropsProvider>
        <ScrollToTop />
        {/* <WithSuspense> */}
        <SidebarRoutes />
        <Header />
        <main className='ms-72 ps-12 me-6 relative mt-32 z-10'>
          <Outlet />
        </main>
        {/* </WithSuspense> */}
      </HeaderPropsProvider>
    </Container>
  );
}

export default Layout;
