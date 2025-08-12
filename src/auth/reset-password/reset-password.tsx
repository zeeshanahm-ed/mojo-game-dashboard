import { Button, Form, Input } from 'antd';
import Container from 'components/core-ui/container/container';
import useBack from 'hooks/use-back';
import LockIcon from 'assets/icons/lock.svg?react';
import { resetPassword } from 'auth/core/_requests';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { handleBack } = useBack();
  const forgotEmail = localStorage.getItem('forgotEmail');
  const verifiedOtp = localStorage.getItem('verifiedOtp');
  const navigate = useNavigate();
  // Function to handle the reset password logic
  const handleResetPassword = async (values: any) => {
    const body = {
      email: forgotEmail,
      newPassword: values?.newPassword,
      confirmPassword: values?.confirmNewPassword,
      otp: verifiedOtp?.replaceAll(",", "")
    }
    try {
      await resetPassword(body);
      showSuccessMessage('Successfully updated!');
      navigate('/auth/sign-in');
      localStorage.removeItem('forgotEmail');
      localStorage.removeItem('verifiedOtp');
    } catch (error) {
      showErrorMessage('Error while updating!');

      console.error('Error:', error);
    }
    // Here, you can perform the API call to reset the password with values.newPassword and values.confirmNewPassword
  };


  return (
    <Container>
      <section className='flex justify-center  w-full h-screen  bg-white relative pt-52 font-urbanist'>
        <div className='w-full flex flex-col max-w-md p-8 space-y-6'>
          {/* Logo and title */}
          <div className="mb-10 text-center">
            <h1 className="text-8xl font-bold tracking-widest font-secondary">MOJO</h1>
            <h2 className="text-2xl font-medium -mt-2">Set New Password</h2>
          </div>
          <Form name='reset-password' autoComplete='off' onFinish={handleResetPassword}>
            <Form.Item
              name='newPassword'
              hasFeedback
              rules={[{
                required: true,
                message: 'Please input your password!',
              }, {
                pattern: /^(.{8,})$/,
                message: 'Password must be at least 8 characters long!',
              },
              ]}
            >
              <Input.Password
                prefix={<LockIcon />}
                className='gap-2 py-3'
                placeholder='New Password'
              />
            </Form.Item>
            <Form.Item
              name='confirmNewPassword'
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockIcon />}
                className='gap-2 py-3'
                placeholder='Confirm New Password'
              />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit' // This makes the button submit the form
                className='h-16 w-full bg-button-blue mt-2'
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleBack} className='h-16 w-full'>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Container>
  );
}

export default ResetPassword;
