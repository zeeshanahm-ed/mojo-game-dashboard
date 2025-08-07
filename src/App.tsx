import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { ConfigProvider } from 'antd';
import { AuthInit, AuthProvider } from 'auth/core/auth-context';
import { setupAxios } from 'auth/core/auth-helpers';
import rqConfigs from 'configs/rq-configs';

import Router from 'routes/router';

setupAxios();
const queryClient = new QueryClient(rqConfigs);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthInit>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#0972C8',
                fontFamily: 'Product_sans',

              },
              components: {
                Input: {
                  paddingBlock: 15,
                  fontSize: 16,
                },
                Button: {
                  fontSize: 16,
                  fontWeight: 'normal',
                },
                Table: {
                  lineWidth: 1,
                  borderColor: '#bdbdbd',
                  headerBg: '#bdbdbd',
                  headerColor: '#ffffff',
                },
                Pagination: {
                  itemActiveBg: '#0972C8',
                },
                Form: {
                  labelFontSize: 19,
                },
                DatePicker: {
                  fontSize: 16,
                },
                Checkbox: {
                  colorPrimary: '#3292ea',
                },
                Radio: {
                  colorPrimary: '#0972C8',
                  radioSize: 20,
                  fontSize: 18,
                  dotSize: 10,
                  wrapperMarginInlineEnd: 24,
                },
                Popconfirm: {
                  fontSize: 16,
                },
              },
            }}
          >
            <Router />
          </ConfigProvider>
        </AuthInit>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
