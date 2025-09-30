import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { forgotPassCode } from "auth/core/_requests";
import Container from "components/core-ui/container/container";
import useBack from "hooks/use-back";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import MailIcon from "../../assets/icons/mail.svg?react";
import { useState } from "react";
import { useDirection } from "hooks/useGetDirection";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  const { t } = useTranslation();
  const direction = useDirection();
  const { handleBack } = useBack();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    const email = values.email;
    localStorage.setItem("forgotEmail", email);
    const body = { email };
    try {
      setIsLoading(true);
      await forgotPassCode(body);
      showSuccessMessage(t("Reset link sent to your email"));
      navigate("/auth/verification");
    } catch (error: any) {
      showErrorMessage(error?.response?.data?.message);
      console.error("Failed to send reset link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <section className={`flex justify-center items-center w-full h-screen  bg-white relative ${direction === 'ltr' ? 'font-urbanist ' : 'font-arabic'}`}>
        <div className="w-full max-w-md p-8 space-y-6">
          {/* Logo and title */}
          <div className="mb-10 text-center">
            <h1 className="text-[80px] font-bold tracking-widest font-secondary">{t("MOJO")}</h1>
            <h2 className="text-xl font-medium -mt-2">{t("Forgot Password")}</h2>
            <h2 className="text-center text-gray-500 text-base mt-2">
              {t("Enter your email to reset password")}
            </h2>
          </div>

          <Form
            name="forgot-password"
            autoComplete="off"
            onFinish={handleSubmit}
            layout="vertical"
          >
            {/* Email input */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t("Please enter your email") },
                { type: "email", message: t("Please enter a valid email") },
              ]}
            >
              <Input
                prefix={<MailIcon className='mr-3' />}
                size="large"
                className="h-12"
                placeholder={t("Email Address")}
              />
            </Form.Item>

            {/* Submit button */}
            <Form.Item>
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                size="large"
                block
                className={`h-12 bg-black hover:bg-gray-800 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
              >
                {t("Send Reset Link")}
              </Button>
            </Form.Item>

            {/* Cancel button */}
            <Form.Item>
              <Button onClick={handleBack} size="large" className={`h-12 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`} block>
                {t("Cancel")}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <footer className=" text-center text-base absolute bottom-5">
            {t("Copyright")} 2025 MOJO Admin. {t("All rights reserved")}
          </footer>
        </div>
      </section>
    </Container>
  );
}

export default ForgotPassword;
