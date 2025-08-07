import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Divider, Form, Input } from 'antd';
import { getUserByToken } from 'auth/core/_requests';
import { useAuth } from 'auth/core/auth-context';
import Button from 'components/core-ui/button/button';
import Container from 'components/core-ui/container/container';
import { useHeaderProps } from 'components/core/use-header-props';
import { showErrorMessage, showSuccessMessage } from 'utils/messageUtils';
import useUpdatePassword from 'pages/user-management/core/hooks/useUpdatePassword';
import userUpdate from 'pages/user-management/core/hooks/userUpdate';
import LockIcon from 'assets/icons/lock.svg?react';
import MailIcon from 'assets/icons/mail.svg?react';
import UploadIcon from 'assets/icons/upload-icon.svg?react';
import UserIcon from 'assets/icons/user.svg?react';
import * as authHelper from '../../auth/core/auth-helpers';
// import useUploadData from 'pages/services/core/hooks/useUploadData';
import { handleErrorMineImg } from 'components/global/global';

function Settings() {
  const currentUser = authHelper.getUser();
  const token = authHelper.getAuth();
  const { saveAuth, setCurrentUser } = useAuth();
  const { setTitle } = useHeaderProps();
  const { mutation } = userUpdate();
  // const { getSignedUrl } = useUploadData();
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useUpdatePassword();
  const { mutate: mutateVerifyToken } = useMutation((token: any) => getUserByToken(token));

  useEffect(() => {
    setTitle('Settings');
  }, [setTitle]);

  const uploadButton = (
    <div className='h-40 w-40 bg-gray-100 border-4 border-[#727375] hover:bg-[#d8d8d8] transition rounded-full flex flex-centered'>
      <UploadIcon />
    </div>
  );

  // Function to handle image selection
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = event.target.files;
    const s3Keys: string[] = [];
    // if (files && files.length > 0) {
    //   const file = files[0]; // Access the first file

    //   const fileName = file.name; // Get the file name
    //   const fileType = file.type; // Get the file type
    //   const body = {
    //     name: fileName,
    //     type: fileType,
    //   };

    //   const fileArray = Array.from(files);
    //   try {
    //     // Use await to ensure the getSignedUrl call completes before moving to the next file
    //     await new Promise<void>((resolve, reject) => {
    //       getSignedUrl(body, {
    //         onSuccess: async (data) => {
    //           const signedUrl = data?.data?.signedUrl;
    //           if (signedUrl) {
    //             try {
    //               // Await the fetch to ensure each file is uploaded sequentially
    //               await fetch(signedUrl, {
    //                 method: 'PUT',
    //                 headers: {
    //                   Accept: 'application/json',
    //                   'Content-Type': file.type,
    //                 },
    //                 body: fileArray[0],
    //               });

    //               // Push the signed URL to the array after a successful upload
    //               s3Keys.push(signedUrl);
    //               resolve(); // Continue to the next file
    //             } catch (uploadError) {
    //               console.error(`Upload failed for file ${file.name}`, uploadError);
    //               reject(uploadError); // If the upload fails, stop further execution
    //             }
    //           } else {
    //             console.error('Signed URL not found');
    //             reject('Signed URL not found');
    //           }
    //         },
    //         onError: (error) => {
    //           console.error('Failed to get signed URL', error);
    //           reject(error);
    //         },
    //       });
    //     });
    //   } catch (error) {
    //     console.error(`Error handling file ${file.name}`, error);
    //   }
    // } else {
    //   showErrorMessage('No files selected');
    // }
    // After all files are uploaded successfully, save the entry
    const baseUrls = s3Keys.map((url) => {
      // Remove the query parameters by splitting on '?' and taking the first part
      const baseUrl = url.split('?')[0];
      return baseUrl;
    });


    if (baseUrls) {
      const userData = {
        profilePicture: baseUrls[0]
      };

      mutation.mutate(
        { id: currentUser?._id, data: userData },
        {
          onSuccess: () => {

            mutateVerifyToken(token, {
              onSuccess: (res) => {
                setLoading(false);
                const authData = {
                  api_token: token,
                  data: res?.data,
                };
                saveAuth(authData);
                setCurrentUser(res?.data);
              },
            });
            showSuccessMessage('User successfully updated');
          },
          onError: () => {
            showErrorMessage('Failed to update user');
          },
        }
      );
    }

  };

  const handleInformationForm = (values: any) => {

    const body = {
      name: values?.name,
    };
    mutation.mutate(
      { id: currentUser?._id, data: body },
      {
        onSuccess: () => {
          mutateVerifyToken(token, {
            onSuccess: (res) => {
              const authData = {
                api_token: token,
                data: res?.data,
              };
              saveAuth(authData);
              setCurrentUser(res?.data);
            },
          });
          showSuccessMessage('User successfully updated');
        },
        onError: () => {
          showErrorMessage('Failed to update user');
        },
      }
    );
  };

  const handlePasswordForm = (value: any) => {


    const body = {
      currentPassword: value?.currentPassword,
      newPassword: value?.newPassword,
      confirmNewPassword: value?.confirmNewPassword,
    };
    updatePassword(
      { id: currentUser?._id, data: body },
      {
        onSuccess: () => {
          showSuccessMessage('User successfully updated');
        },
        onError: () => {
          showErrorMessage('Failed to update user');
        },
      }
    );
  };

  return (
    <Container>
      <section className='mt-6 font-primary'>
        <h2 className='text-4xl font-semibold'>Settings</h2>
        <p className='text-base pb-9'>Following are the details of your profile</p>
        <Divider />
        <p className='py-5 text-2xl font-semibold'>Profile Picture</p>
        <div className='w-80 flex flex-centered'>
          <Input
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            id='imageUploadInput'
            onChange={handleImageChange} // Call the function on change
            multiple // Allow multiple file selection if needed
            disabled={loading}
          />
          {currentUser?.profilePicture ?
            <label
              htmlFor='imageUploadInput'
              className='relative flex rounded-full border-2 cursor-pointer flex-centered h-40 w-40'
            >
              <img src={currentUser?.profilePicture} alt='profle' className='rounded-full w-full h-full bg-cover' onError={handleErrorMineImg} />

            </label>
            :
            <label
              htmlFor='imageUploadInput'
              className='relative flex rounded-full border-2 cursor-pointer flex-centered h-40 w-40'
            >{uploadButton}

            </label>
          }

        </div>

        {/* Display the selected images */}
        {/* <div className='mt-4 flex flex-wrap gap-4'>
          {images.map((image, index) => (
            <div key={index} className='h-32 w-32'>
              <img
                src={image}
                alt={`Selected ${index}`}
                className='h-full w-full object-cover rounded-md'
              />
            </div>
          ))}
        </div> */}

        <div className='flex gap-10'>
          <div className='w-80'>
            <p className='py-5 text-2xl font-semibold'>Information</p>
            <Form
              name='information-form'
              initialValues={{
                name: currentUser?.name || '',
                email: currentUser?.email || '',
              }}
              autoComplete='off'
              onFinish={handleInformationForm}
            >
              <Form.Item
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'Please input your Name!',
                    whitespace: true,
                  },
                ]}
              >
                <Input prefix={<UserIcon />} className='gap-2' placeholder='Name' />
              </Form.Item>
              <Form.Item
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email!',
                  },
                ]}
              >
                <Input prefix={<MailIcon />} className='gap-2' type='email' placeholder='Email Address' disabled />
              </Form.Item>
              <Form.Item>
                <Button
                  type='submit'
                  className='w-full h-16 font-primary font-medium text-lg bg-secondary flex flex-centered transition'
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className='h-80 bg-gray-100 w-0.5 my-auto' />
          <div className='w-80'>
            <p className='py-5 text-2xl font-semibold'>Password</p>
            <Form name='basic' autoComplete='off' onFinish={handlePasswordForm}>
              <Form.Item
                name='currentPassword'
                rules={[
                  {
                    required: true,
                    message: 'Please input your Current password!',
                  },
                ]}
              >
                <Input.Password prefix={<LockIcon />} className='gap-2' placeholder='Current Password' />
              </Form.Item>
              <Form.Item
                name='newPassword'
                rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                  {
                    pattern: /^(.{8,})$/,
                    message: 'Password must be at least 8 characters long!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password prefix={<LockIcon />} className='gap-2' placeholder='New Password' />
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
                      return Promise.reject(new Error('The new passwords you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockIcon />} className='gap-2' placeholder='Confirm New Password' />
              </Form.Item>
              <Form.Item>
                <Button
                  type='submit'
                  className='w-full h-16 font-primary font-medium text-lg bg-secondary flex flex-centered transition'
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
    </Container>
  );
}

export default Settings;

