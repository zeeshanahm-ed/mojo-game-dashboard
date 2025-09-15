import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { forgotPassCode } from "auth/core/_requests";
import Container from "components/core-ui/container/container";
import useBack from "hooks/use-back";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import MailIcon from "../../assets/icons/mail.svg?react";
import { useState } from "react";

function ForgotPassword() {
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
      showSuccessMessage("Reset link sent to your email!");
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
      <section className="flex justify-center  w-full h-screen  bg-white relative pt-52 font-urbanist">
        <div className="w-full max-w-md p-8 space-y-6">
          {/* Logo and title */}
          <div className="mb-10 text-center">
            <h1 className="text-8xl font-bold tracking-widest font-secondary">MOJO</h1>
            <h2 className="text-2xl font-medium -mt-2"> Forgot Password</h2>
            <h2 className="text-center text-gray-500 text-base mt-2">
              Enter your email to reset password
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
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailIcon />}
                size="large"
                placeholder="Email Address"
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
                className="h-12 bg-black hover:bg-gray-800"
              >
                Send Reset Link
              </Button>
            </Form.Item>

            {/* Cancel button */}
            <Form.Item>
              <Button onClick={handleBack} size="large" className="h-12" block>
                Cancel
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <footer className=" text-center text-lg absolute bottom-10">
            Copyright 2025 MOJO Admin. All rights reserved.
          </footer>
        </div>
      </section>
    </Container>
  );
}

export default ForgotPassword;
