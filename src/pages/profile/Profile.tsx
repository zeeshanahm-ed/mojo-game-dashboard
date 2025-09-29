import React, { useEffect, useState } from "react";
import { Input, Button, Checkbox, Divider } from "antd";
import { IUserModel } from "auth";
import * as authHelper from '../../auth/core/auth-helpers';
import { useHeaderProps } from "components/core/use-header-props";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import useChangePassword from "auth/core/hooks/use-change-password";
import { ROLESLABEL } from "utils/Enums";
import { useTranslation } from "react-i18next";
import { useDirection } from "hooks/useGetDirection";

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const direction = useDirection();
    const { setTitle } = useHeaderProps();
    const currentUser: IUserModel | undefined = authHelper.getUser();
    const { changePasswordMutate, isLoading } = useChangePassword();
    const [passState, setPassState] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleOnChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPassState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => setTitle(t('Profile')), []);


    const handleChangePassword = () => {
        if (
            !passState.currentPassword ||
            !passState.newPassword ||
            !passState.confirmPassword
        ) {
            showErrorMessage(t('All password fields are required'));
            return;
        }
        if (passState.newPassword !== passState.confirmPassword) {
            showErrorMessage(t('New password and confirmation password do not match'));
            return;
        }
        handlePasswordChange();
    };


    const handlePasswordChange = () => {

        const body = {
            currentPassword: passState.currentPassword.trim(),
            newPassword: passState.newPassword.trim(),
            confirmPassword: passState.confirmPassword.trim(),
        };
        changePasswordMutate(body, {
            onSuccess: () => {
                showSuccessMessage(t('Password updated successfully'));
                resetState();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
            },
        }
        );
    };

    const resetState = () => {
        setPassState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };


    return (
        <section>
            {/* User info */}
            <div className="grid grid-cols-3 gap-6 gap-y-12 text-lg mb-10">
                <div>
                    <p className="text-medium-gray">{t('Full Name')}</p>
                    <p className=" mt-5">{`${currentUser?.firstName} ${currentUser?.lastName}`}</p>
                </div>
                <div>
                    <p className="text-medium-gray">{t('Email Address')}</p>
                    <p className=" mt-5">{currentUser?.email}</p>
                </div>
                <div>
                    <p className="text-medium-gray">{t('Phone Number')}</p>
                    <p className=" mt-5">{currentUser?.phoneNumber}</p>
                </div>
                <div>
                    <p className="text-medium-gray">{t('User Role')}</p>
                    <p className="mt-5">{ROLESLABEL[currentUser?.role as keyof typeof ROLESLABEL]}</p>
                </div>
                <div className="">
                    <p className="text-medium-gray">{t('Status')}</p>
                    <div className="flex gap-x-4 mt-5">
                        <Checkbox checked={currentUser?.status === "Active"} disabled />
                        <span>{t(currentUser?.status as string)}</span>
                    </div>
                </div>
            </div>

            <Divider />

            {/* Password change */}
            <div className="grid grid-cols-4 gap-4 mt-10">
                <Input.Password
                    dir={direction}
                    placeholder={t('Enter current password')}
                    name="currentPassword"
                    type="password"
                    value={passState.currentPassword}
                    onChange={(e) => handleOnChangePass(e)}
                />
                <Input.Password
                    dir={direction}
                    placeholder={t('Enter new password')}
                    type="password"
                    value={passState.newPassword}
                    onChange={(e) => handleOnChangePass(e)}
                    name="newPassword"
                />
                <Input.Password
                    dir={direction}
                    placeholder={t('Re-enter new password')}
                    type="password"
                    value={passState.confirmPassword}
                    onChange={(e) => handleOnChangePass(e)}
                    name="confirmPassword"
                />
                <Button
                    type="primary"
                    className={`bg-black text-white h-full rounded-lg`}
                    onClick={handleChangePassword}
                    loading={isLoading}
                >
                    {t('Change Password')}
                </Button>
            </div>
        </section>
    );
};

export default Profile;
