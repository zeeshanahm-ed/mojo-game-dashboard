
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Alert, Button, Form, Input } from 'antd';

import Container from 'components/core-ui/container/container';

import LockIcon from '../assets/icons/lock.svg?react';
import MailIcon from '../assets/icons/mail.svg?react';
import UserIcon from '../assets/icons/user.svg?react';
import AuthOverlay from './components/auth-overlay';
import useSignUp from './core/hooks/use-sign-up';

function SignUp() {
  const navigate = useNavigate();
  const { mutate, isError, error, isLoading, isSuccess } = useSignUp();

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      department: 'ADMIN',
      role: 'user',
    };

    mutate(payload);
  };
  useEffect(() => {
    if (isSuccess) {
      navigate('/auth/sign-in');
    }
  }, [isSuccess, navigate]);

  const getErrorMessage = (): React.ReactNode => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else if (error && (error as any).response?.data?.message) {
      return (error as any).response.data.message;
    } else {
      return 'An error occurred during signup.';
    }
  };

  return (
    <Container>
      <section className='font-inter px-7 flex justify-center gap-14 2xl:gap-28 items-center w-full h-screen'>
        <AuthOverlay />
        <div className='h-120 bg-gray-200 w-0.5' />
        <div className='w-96'>
          <h2 className='text-3xl pb-10 font-semibold text-center'>Sign Up</h2>

          {isError && <Alert type='error' showIcon message={getErrorMessage()} closable />}

          {isSuccess && (
            <Alert
              type='success'
              showIcon
              message='Registration successful! Please check your email to verify your account.'
              closable
            />
          )}

          <Form name='sign-up' onFinish={onFinish} initialValues={{ remember: true }} autoComplete='off'>
            <Form.Item
              name='name'
              rules={[
                { required: true, message: 'Please input your Name!', whitespace: true },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: 'Please enter valid characters for your Name!',
                },
              ]}
            >
              <Input prefix={<UserIcon />} className='gap-2' placeholder='Name' />
            </Form.Item>
            <Form.Item
              name='email'
              rules={[
                {
                  type: 'email',
                  message: 'The input is not a valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input prefix={<MailIcon />} className='gap-2' placeholder='Email Address' />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  pattern: /^(.{8,})$/,
                  message: 'Password must be at least 8 characters long!',
                },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockIcon />} className='gap-2' placeholder='Password' type='password' />
            </Form.Item>
            <Form.Item
              name='confirmPassword'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockIcon />} className='gap-2' placeholder='Confirm Password' type='password' />
            </Form.Item>
            <Form.Item>
              <Button
                loading={isLoading}
                className='h-16 text-white tracking-wider'
                htmlType='submit'
                type='primary'
                block
              >
                Register
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to='/auth/sign-in'>
                <Button className='h-16' block>
                  Login
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Container>
  );
}

export default SignUp;
