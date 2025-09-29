import React, { useEffect, useMemo, useState } from "react";
import { Modal, Input, Upload, Button, Divider, Select, Tooltip } from "antd";
import useAddCategory from "pages/questionNCategory/categories/core/hooks/useAddCategory";
import FallbackLoader from "components/core-ui/fallback-loader/FallbackLoader";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import useUpdateCategory from "pages/questionNCategory/categories/core/hooks/useUpdateCategory";
//icons
import { UploadOutlined } from "@ant-design/icons";
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import { QUERIES_KEYS } from "helpers/crud-helper/consts";
import { useQueryClient } from "react-query";
import useChangeCategoryStatus from "pages/questionNCategory/categories/core/hooks/useChangeCategoryStatuc";
import { useDirection } from "hooks/useGetDirection";
import { useTranslation } from "react-i18next";
import { getFileName } from "helpers/CustomHelpers";


interface AddCategoryModalProps {
    open: boolean;
    editData: any;
    onClose: () => void;
    refatchCategoriesData: () => void;
}

type ErrorStateType = {
    categoryMedia: string;
}

const AddNEditCategoryModal: React.FC<AddCategoryModalProps> = ({
    open,
    onClose,
    refatchCategoriesData,
    editData
}) => {
    const direction = useDirection();
    const { t } = useTranslation();
    const [categoryName, setCategoryName] = useState("");
    const { addCategoryMutate, isAddCategoryLoading } = useAddCategory();
    const { updateCategoryMutate, isUpdateCategoryLoading } = useUpdateCategory();
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { changeCategoryStatusMutate, isChangeStatusLoading } = useChangeCategoryStatus();
    const [selectedStatus, setSelectedStatus] = useState<string>("Active");
    const [errorState, setErrorState] = useState<ErrorStateType>({
        categoryMedia: "",
    });

    useEffect(() => {
        if (editData) {
            setCategoryName(editData?.name);
            setFileUrl(editData?.photo);
            if (editData?.status) {
                setSelectedStatus(editData.status);
            }
        }
    }, [editData]);

    // Detect if changes made
    const isChanged = useMemo(() => {
        if (!editData) return categoryName.trim() !== "" && !!file;
        return true

    }, [editData, categoryName, file, fileUrl]);

    const fileValidation = (file: File | undefined) => {
        if (!file) {
            return { error: true, message: t("Please select a file") };
        }

        // Only allow image files
        const IMAGE_FILE_TYPES = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const maxSize = 20; // MB
        const typeName = "Image";

        const fileExt = file.type.split("/")[1] || file.name.split(".").pop();
        const fileSizeMB = file.size / (1024 * 1024);

        // Check file extension
        if (!IMAGE_FILE_TYPES.includes(`.${fileExt?.toLowerCase()}`)) {
            return {
                error: true,
                message: t("typeLimit", { typeName, formats: IMAGE_FILE_TYPES.join(", ") })
            };
        }

        // Check file size
        if (fileSizeMB > maxSize) {
            return {
                error: true,
                message: t("sizeLimit", { typeName, maxSize })
            };
        }

        return { error: false, message: "" };
    };

    const handleUpload = (info: any) => {
        const file = info.file;
        const error = fileValidation(file);
        if (error.error) {
            setErrorState(prev => ({
                ...prev,
                categoryMedia: error.message
            }));
            return;
        } else {
            setErrorState(prev => ({
                ...prev,
                categoryMedia: ""
            }));
        }
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setFileUrl(null);
    };

    const handleSubmit = () => {
        if (editData) {
            handleUpdate();
        } else {
            handleAdd();
        }
    };

    const handleUpdate = () => {
        if (!categoryName.trim()) return;
        const formData = new FormData();
        formData.append("name", categoryName);
        if (file) {
            formData.append("photo", file as File);
        } else {
            formData.append("photo", editData?.photo);
        }

        updateCategoryMutate({ body: formData, id: editData?._id }, {
            onSuccess: () => {
                showSuccessMessage(t("Category updated successfully"));
                refatchCategoriesData();
                queryClient.invalidateQueries(QUERIES_KEYS.GET_ALL_CATEGORIES);
                setFile(null);
                setCategoryName("");
                onClose();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    const handleAdd = () => {
        if (!categoryName.trim()) return;

        const formData = new FormData();
        formData.append("name", categoryName);
        formData.append("photo", file as File);

        addCategoryMutate(formData, {
            onSuccess: () => {
                showSuccessMessage(t("Category added successfully"));
                queryClient.invalidateQueries(QUERIES_KEYS.GET_ALL_CATEGORIES);
                refatchCategoriesData();
                setFile(null);
                setCategoryName("");
                onClose();
            },
            onError: (error: any) => {
                showErrorMessage(error?.response?.data?.message);
                console.error('Error:', error);
            },
        });
    };

    const Options = [
        { value: "Active", name: "Active" },
        { value: "Inactive", name: "Inactive" },
        { value: "Rejected", name: "Rejected" },
        { value: "Pending", name: "Pending" },
    ];

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        if (!editData?._id) return;
        changeCategoryStatusMutate(
            { id: editData._id, params: { status: value } },
            {
                onSuccess: () => {
                    showSuccessMessage(t("Status updated successfully"));
                    queryClient.invalidateQueries(QUERIES_KEYS.GET_ALL_CATEGORIES);
                    refatchCategoriesData();
                },
                onError: (error: any) => {
                    showErrorMessage(error?.response?.data?.message);
                    setSelectedStatus(editData?.status || "Pending");
                },
            }
        );
    };

    const handleClose = () => {
        setCategoryName("");
        setFile(null);
        setFileUrl(null);
        setSelectedStatus("Pending");
        setErrorState({ categoryMedia: "" });
        onClose();
    }

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            centered
            maskClosable={false}
            width={700}
            className={`${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
            title={<p className='font-normal text-2xl'>{editData ? t('Edit Category') : t('Add New Category')}</p>}
        >
            {isAddCategoryLoading || isUpdateCategoryLoading ? <FallbackLoader isModal={true} /> : null}
            <Divider />
            <div>
                <div className="flex gap-6 py-5">
                    {/* Category Name */}
                    <div className="flex w-1/2 flex-col gap-4">
                        <p className="w-fit text-base">{t('Category Name')}</p>
                        <Input
                            placeholder={t('Enter Category Name')}
                            value={categoryName}
                            dir={direction}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className={`w-full h-12 ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
                        />
                    </div>

                    {/* Upload Photo */}
                    <div className="flex w-1/2 flex-col gap-4">
                        <span className="w-fit text-base">{t('Upload Category Photo')}</span>
                        <div className="flex items-center gap-3 h-12 border rounded-lg px-3 py-2 full">
                            {fileUrl ? (
                                <>
                                    <img
                                        src={fileUrl || ""}
                                        alt="preview"
                                        className="w-8 h-8 object-contain"
                                    />
                                    <Tooltip title={getFileName(fileUrl)}>
                                        <span className="truncate">{file?.name || getFileName(fileUrl)}</span>
                                    </Tooltip>
                                    <Button
                                        type="text"
                                        className="ml-auto"
                                        icon={<DeleteIcon className="text-error-500" />}
                                        onClick={handleRemove}
                                    />
                                </>
                            ) : (
                                <Upload
                                    beforeUpload={() => false} // prevent auto upload
                                    onChange={handleUpload}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>{t('Upload')}</Button>
                                </Upload>
                            )}
                        </div>
                        {errorState.categoryMedia && <p className="text-red-500 text-sm">{errorState.categoryMedia}</p>}
                    </div>
                </div>
                <div>
                    <p className="w-fit text-base mb-2">{t('Status')}</p>
                    <Select
                        className={`w-full ${direction === 'ltr' ? 'font-primary' : 'font-arabic'}`}
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        options={Options.map((opt) => ({ value: opt.value, label: opt.name }))}
                        loading={isChangeStatusLoading}
                        disabled={!editData}
                    />
                </div>
            </div>
            <Divider />
            {/* Submit Button */}
            <div className="flex justify-end">
                <Button type="primary" disabled={!isChanged} className={`h-12`} onClick={handleSubmit}>
                    {editData ? t('Update Category') : t('Add Category')}
                </Button>
            </div>
        </Modal>
    );
};

export default AddNEditCategoryModal;
