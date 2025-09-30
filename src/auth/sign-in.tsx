import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';

// You can uncomment these icons later:
import LockIcon from '../assets/icons/lock.svg?react';
import MailIcon from '../assets/icons/mail.svg?react';

import useSignIn from './core/hooks/use-sign-in';
import { useAuth } from './core/auth-context';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useVerifyToken from './core/hooks/use-verify-token';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

function SignIn() {
  const { t } = useTranslation();
  const { signInMutate, isLoading } = useSignIn();
  const { mutateVerifyToken, isLoading: verifyTokenLoding } = useVerifyToken();
  const { currentUser, saveAuth, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const direction = useDirection();

  const onFinish = async (values: any) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    signInMutate(payload, {
      onSuccess: async (res) => {
        if (res) {
          const apiToken = res.data.data.data.token;
          if (apiToken) {
            mutateVerifyToken(apiToken, {
              onSuccess: (res) => {
                showSuccessMessage(t('User login successfully'));
                const authData = {
                  api_token: apiToken,
                  data: res?.data?.data?.data,
                };
                saveAuth(authData);
                setCurrentUser(authData?.data);
              },
            });
          }
        }
      },
      onError: (error: any) => {
        showErrorMessage(error?.response?.data?.message);
        console.error('Failed to sign in user:', error);
      },
    });
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div className={`min-h-screen flex flex-col items-center bg-white relative justify-center ${direction === 'ltr' ? 'font-urbanist ' : 'font-arabic'}`}>
      {/* Logo and title */}
      <div className="mb-10 text-center">
        <h1 className="text-[80px] font-bold tracking-widest font-secondary">{t('MOJO')}</h1>
        <h2 className="text-xl font-medium -mt-2">{t('Admin Portal')}</h2>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm">
        <Form
          name="sign-in"
          onFinish={onFinish}
          initialValues={{ email: '', password: '' }}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            // label="Email Address"
            name="email"
            rules={[
              { required: true, message: t('Please input your email') }
            ]}
          >
            <Input
              prefix={<MailIcon className='mr-3' />}
              type="email"
              placeholder={t('Email Address')}
              className="h-12 py-0"
            />
          </Form.Item>

          <Form.Item
            // label="Password"
            name="password"
            rules={[{
              required: true,
              message: t('Please input your password'),
            }, {
              pattern: /^(.{8,})$/,
              message: t('Password must be at least 8 characters long'),
            },
            ]}
          >
            <Input.Password
              prefix={<LockIcon className='mr-3' />}
              placeholder={t('Password')}
              className="h-12 py-0"
            />
          </Form.Item>


          <Button
            loading={isLoading || verifyTokenLoding}
            type="primary"
            htmlType="submit"
            block
            className={`h-12 bg-black text-white hover:bg-gray-800 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
          >
            {t('Login')}
          </Button>

          <div className="flex justify-end mt-4">
            <Link to="/auth/forgot-password" className={`text-sm ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>
              {t('Forgot Password?')}
            </Link>
          </div>
        </Form>
      </div>

      {/* Footer */}
      <footer className=" text-center text-base absolute bottom-5">
        {t('Copyright')} 2025 MOJO Admin. {t('All rights reserved')}
      </footer>
    </div>
  );
}

export default SignIn;
