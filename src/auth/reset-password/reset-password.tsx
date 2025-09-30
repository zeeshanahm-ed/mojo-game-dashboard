import { Button, Form, Input } from 'antd';
import Container from 'components/core-ui/container/container';
import useBack from 'hooks/use-back';
import LockIcon from 'assets/icons/lock.svg?react';
import { resetPassword } from 'auth/core/_requests';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDirection } from 'hooks/useGetDirection';

function ResetPassword() {
  const { t } = useTranslation();
  const direction = useDirection();
  const { handleBack } = useBack();
  const [isLoading, setIsLoading] = useState(false);
  const forgotEmail = localStorage.getItem('forgotEmail');
  const verifiedOtp = localStorage.getItem('verifiedOtp');
  const navigate = useNavigate();
  // Function to handle the reset password logic
  const handleResetPassword = async (values: any) => {
    const body = {
      email: forgotEmail,
      newPassword: values?.newPassword,
      confirmPassword: values?.confirmNewPassword,
      otp: verifiedOtp?.replace(/,/g, "")
    }
    try {
      setIsLoading(true);
      await resetPassword(body);
      showSuccessMessage(t('Successfully updated'));
      navigate('/auth/sign-in');
      localStorage.removeItem('forgotEmail');
      localStorage.removeItem('verifiedOtp');
    } catch (error: any) {
      showErrorMessage(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Container>
      <section className={`flex justify-center  w-full h-screen  bg-white relative items-center ${direction === 'ltr' ? 'font-urbanist ' : 'font-arabic'}`}>
        <div className='w-full flex flex-col max-w-md p-8 space-y-6'>
          {/* Logo and title */}
          <div className="mb-10 text-center">
            <h1 className="text-[80px] font-bold tracking-widest font-secondary">{t("MOJO")}</h1>
            <h2 className="text-xl font-medium -mt-2">{t("Set New Password")}</h2>
          </div>
          <Form name='reset-password' autoComplete='off' onFinish={handleResetPassword}>
            <Form.Item
              name='newPassword'
              hasFeedback
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
                className='h-12'
                placeholder={t('New Password')}
              />
            </Form.Item>
            <Form.Item
              name='confirmNewPassword'
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t('Please input your confirm password'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('Confirm password does not match')));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockIcon className='mr-3' />}
                className='h-12'
                placeholder={t('Confirm New Password')}
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoading}
                type='primary'
                htmlType='submit'
                className={`h-12 w-full bg-button-blue mt-2 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
              >
                {t('Submit')}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleBack} className={`h-12 w-full ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}>
                {t('Cancel')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Container>
  );
}

export default ResetPassword;
