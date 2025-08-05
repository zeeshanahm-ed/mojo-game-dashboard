import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import AuthOverlay from 'auth/components/auth-overlay';
import Container from 'components/core-ui/container/container';
import useBack from 'hooks/use-back';
import { verifyOtp } from 'auth/core/_requests';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { useNavigate } from 'react-router-dom';

function Verification() {
  const navigate = useNavigate();
  const forgotEmail = localStorage.getItem('forgotEmail');
  const { handleBack } = useBack();
  const [countdown, setCountdown] = useState(59);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [otp, setOtp] = useState(''); // State to hold the OTP

  const handleVerifyOTP = async(event: any) => {
    event.preventDefault(); // Prevent default form submission

    if (otp.length < 6) {
      return; 
    }

    const body = {
      email: forgotEmail,
      otp:otp
    }
    try {
       await verifyOtp(body); 
      showSuccessMessage('Verified Otp');
      localStorage.setItem('verifiedOtp',otp);
      navigate('/auth/reset-password');
    } catch (error) {
      showErrorMessage('Invalid otp. Time out!');

      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const storedTimestamp = localStorage.getItem('resendTimestamp');
    if (storedTimestamp) {
      const diff = Math.floor((Date.now() - parseInt(storedTimestamp, 10)) / 1000);
      if (diff < 59) {
        setResendDisabled(true);
        setCountdown(59 - diff);
      }
    }
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [resendDisabled, countdown]);

  return (
    <Container>
      <section className='flex pe-10 justify-center gap-10 items-center w-full h-screen relative z-10 font-inter'>
        <AuthOverlay />
        <div className='block h-96 bg-gray-100 w-0.5' />
        <div className='w-96'>
          <h1 className='text-3xl pb-1 font-semibold text-black'>Verify OTP</h1>
          <h1 className='text-lg pb-8 text-gray-600'>Enter 6 digit OTP you received on email</h1>
          <Form name='verification' autoComplete='off' onSubmitCapture={handleVerifyOTP}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please enter the OTP!',
                },
              ]}
              name='otp'
            >
              <Input.OTP
                className='otp'
                onChange={(value) => setOtp(value)} 
              />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                onClick={handleVerifyOTP}
                className='h-14 w-full bg-button-blue'
                disabled={otp.length < 6} // Disable button if OTP is incomplete
              >
                Submit
              </Button>
            </Form.Item>

            <Button
              type='primary'
              className='h-14 mb-5 w-full text-white disabled:text-white disabled:scale-100 disabled:bg-secondary'
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend OTP (${countdown})` : 'Resend OTP'}
            </Button>

            <Form.Item>
              <Button onClick={handleBack} className='h-14 w-full'>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Container>
  );
}

export default Verification;
