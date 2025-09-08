import React, { useEffect, useMemo, useState } from "react";
import { Modal, Input, Upload, Button, Divider } from "antd";
import useAddCategory from "pages/questionNCategory/categories/core/hooks/useAddCategory";
import FallbackLoader from "components/core-ui/fallback-loader/FallbackLoader";
import { showErrorMessage, showSuccessMessage } from "utils/messageUtils";
import useUpdateCategory from "pages/questionNCategory/categories/core/hooks/useUpdateCategory";
//icons
import { UploadOutlined } from "@ant-design/icons";
import DeleteIcon from 'assets/icons/delete-icon.svg?react';
import { QUERIES_KEYS } from "helpers/crud-helper/consts";
import { useQueryClient } from "react-query";


interface AddCategoryModalProps {
    open: boolean;
    editData: any;
    onClose: () => void;
    refatchCategoriesData: () => void;
}

const AddNEditCategoryModal: React.FC<AddCategoryModalProps> = ({
    open,
    onClose,
    refatchCategoriesData,
    editData
}) => {
    const [categoryName, setCategoryName] = useState("");
    const { addCategoryMutate, isAddCategoryLoading } = useAddCategory();
    const { updateCategoryMutate, isUpdateCategoryLoading } = useUpdateCategory();
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();


    useEffect(() => {
        if (editData) {
            setCategoryName(editData?.name);
            setFileUrl(editData?.photo);
        }
    }, [editData]);

    // Detect if changes made
    const isChanged = useMemo(() => {
        if (!editData) return categoryName.trim() !== "" || !!file;
        return (
            editData.name !== categoryName.trim() ||
            (editData?.name || null) !== (file?.name || null)
        );
    }, [editData, categoryName, file]);

    const handleUpload = (info: any) => {
        const file = info.file;
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
                showSuccessMessage("Category updated successfully.");
                refatchCategoriesData();
                queryClient.invalidateQueries(QUERIES_KEYS.GET_ALL_CATEGORIES);
                setFile(null);
                setCategoryName("");
                onClose();
            },
            onError: () => {
                showErrorMessage("An error occurred while updating the category.");
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
                showSuccessMessage("Category added successfully.");
                queryClient.invalidateQueries(QUERIES_KEYS.GET_ALL_CATEGORIES);
                refatchCategoriesData();
                setFile(null);
                setCategoryName("");
                onClose();
            },
            onError: () => {
                showErrorMessage("An error occurred while adding the category.");
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            maskClosable={false}
            width={700}
            title={<p className='font-normal text-2xl'>{editData ? 'Edit category' : 'Add new category'}</p>}
        >
            {isAddCategoryLoading || isUpdateCategoryLoading ? <FallbackLoader isModal={true} /> : null}
            <Divider />
            <div className="flex gap-6 py-5">
                {/* Category Name */}
                <div className="flex w-1/2 flex-col gap-4">
                    <p className="w-fit text-base">Category Name</p>
                    <Input
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full h-12"
                    />
                </div>

                {/* Upload Photo */}
                <div className="flex w-3/4 flex-col gap-4">
                    <span className="w-fit text-base">Upload category photo</span>
                    <div className="flex items-center gap-3 h-12 border rounded-lg px-3 py-2 flex-1">
                        {fileUrl ? (
                            <>
                                <img
                                    src={fileUrl || ""}
                                    alt="preview"
                                    className="w-8 h-8 object-contain"
                                />
                                <span className="truncate">{file?.name}</span>
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
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        )}
                    </div>
                </div>
            </div>
            <Divider />
            {/* Submit Button */}
            <div className="flex justify-end">
                <Button type="primary" disabled={!isChanged} className="h-12" onClick={handleSubmit}>
                    {editData ? 'Update category' : 'Add category'}
                </Button>
            </div>
        </Modal>
    );
};

export default AddNEditCategoryModal;
