import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import Container from 'components/core-ui/container/container';
import useBack from 'hooks/use-back';
import { forgotPassCode, verifyOtp } from 'auth/core/_requests';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import { useNavigate } from 'react-router-dom';

function Verification() {
  const navigate = useNavigate();
  const forgotEmail = localStorage.getItem('forgotEmail');
  const { handleBack } = useBack();
  const [countdown, setCountdown] = useState(59);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [otp, setOtp] = useState<any>();

  const handleVerifyOTP = async (event: any) => {
    event.preventDefault(); // Prevent default form submission

    if (otp.length < 6) {
      return;
    }

    const body = {
      email: forgotEmail,
      otp: otp?.join(",").replaceAll(",", "")
    }

    try {
      await verifyOtp(body);
      showSuccessMessage('Otp has been varified.');
      localStorage.setItem('verifiedOtp', otp);
      navigate('/auth/reset-password');
    } catch (error: any) {
      showErrorMessage(error.response.data.message);
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


  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  // Load timer state from localStorage on mount
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

  // Countdown logic
  useEffect(() => {
    let timer: number | undefined;
    if (resendDisabled && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      localStorage.removeItem('resendTimestamp');
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendDisabled, countdown]);

  const handleResendOtp = async () => {

    if (resendDisabled) return;

    try {
      await forgotPassCode({ email: forgotEmail });
      showSuccessMessage('OTP resent successfully!');
      setResendDisabled(true);
      setCountdown(59);
      localStorage.setItem('resendTimestamp', Date.now().toString());
    } catch (error) {
      showErrorMessage('Error while resending OTP!');
      console.error('Resend OTP Error:', error);
    }
  };

  return (
    <Container>
      <section className='flex justify-center  w-full h-screen  bg-white relative pt-52 font-urbanist'>
        <div className='w-full flex flex-col max-w-md p-8 space-y-6'>
          {/* Logo and title */}
          <div className="mb-10 text-center">
            <h1 className="text-8xl font-bold tracking-widest font-secondary">MOJO</h1>
            <h2 className="text-2xl font-medium -mt-2"> Verify OTP</h2>
            <h2 className="text-center text-gray-500 text-base mt-2">
              Enter 6 digit OTP you received on email
            </h2>
          </div>

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
                className="otp"
                value={otp}
                length={6}
                formatter={(str) => str.replace(/\D/g, '')}
                onInput={(value: any) => handleOtpChange(value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                onClick={handleVerifyOTP}
                className='h-14 w-full bg-button-blue'
                disabled={otp?.length !== 6}
              >
                Submit
              </Button>
            </Form.Item>

            <div className='flex flex-row gap-x-2 justify-center'>
              <Button onClick={handleBack} className='h-14 w-full'>
                Cancel
              </Button>
              <Button
                type='primary'
                onClick={handleResendOtp}
                className='h-14 mb-5 w-full text-white disabled:text-white disabled:scale-100 disabled:bg-secondary'
                disabled={resendDisabled}
              >
                {resendDisabled ? `Resend OTP (${countdown})` : 'Resend OTP'}
              </Button>
            </div>
          </Form>
        </div>
      </section>
    </Container>
  );
}

export default Verification;
