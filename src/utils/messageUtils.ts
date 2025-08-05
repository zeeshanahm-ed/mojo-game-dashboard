// messageUtils.ts
import { message } from 'antd';

const messageApi = message;

export const showMessage = (type: 'success' | 'error', content: string, duration: number = 10) => {
  messageApi.open({
    type,
    content,
    duration,
  });
};

export const showSuccessMessage = (content: string) => {
  showMessage('success', content, 3);
};

export const showErrorMessage = (content: string) => {
  showMessage('error', content, 3);
};
