import { Button, Form, message, Modal } from "antd";
import ControlledInputRichText from "components/form/controlled-inputs/controlled-input-rich-text";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import EllipsisMiddle from "components/ellipsis-text/ellipsis-middle";
import { useMutation } from "react-query";
import heroService from "services/hero";
import authService from "services/auth";
import fileService from "services/file";
import { Application } from "models";

type Props = {
    idPoster: string;
    refetchQuery: () => void;
    children: (dt: { showModal: () => void; handleCancel: () => void }) => any;
};

interface ApplicationLetter {
    description: string;
}

const schema: yup.SchemaOf<ApplicationLetter> = yup.object().shape({
    description: yup.string().required("Letter bid is required!"),
});

function ModalApplication({ children, refetchQuery, idPoster }: Props) {
    const user = authService.CurrentUser();

    const [form] = Form.useForm();
    const [file, setFile] = useState<File | null>(null);
    const btnSubmitRef = useRef<HTMLButtonElement | null>(null);

    const {
        handleSubmit,
        control,
        formState: { isValid },
        watch,
    } = useForm<ApplicationLetter>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleFileChange = (fl: File) => {
        setFile(fl);
    };

    const bidMutation = useMutation(
        async (application: Partial<Application>) => {
            await heroService.SendApplication({ pid: idPoster, uid: user?.uid as any, data: application as Application });
        },
        {
            onSuccess: () => {
                refetchQuery();
                setIsModalOpen(false);
                message.success("Application letter sent successfully");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const uploadFileMutation = useMutation(
        async (fl: File) => {
            const ref = await fileService.UploadFileAndGetDownloadUrl(fl);
            return ref;
        },
        {
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onSubmitHandler = handleSubmit(async (data) => {
        if (file) {
            const url = await uploadFileMutation.mutateAsync(file);
            bidMutation.mutate({
                ...data,
                cv: url,
            });
            return;
        }
        bidMutation.mutate(data);
    });

    const onClickSend = () => {
        if (btnSubmitRef.current) {
            btnSubmitRef.current.click();
        }
    };

    return (
        <>
            <Modal width={800} footer={null} title="Application Letter" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    colon={false}
                    style={{ width: "100%" }}
                    layout="horizontal"
                    onFinish={onSubmitHandler}
                >
                    <ControlledInputRichText
                        control={control}
                        name="description"
                        placeholder="Make it as interesting as possible"
                        label=""
                        className=""
                    />
                    <button ref={btnSubmitRef} type="submit" className="hidden">
                        submit
                    </button>
                </Form>
                <div className="flex items-start justify-between w-full mt-10">
                    <InputFile handleChange={handleFileChange} name="document" types={["png", "jpg", "jpeg", "pdf", "zip", "doc", "rar"]}>
                        <div className="bg-gray-200 capitalize border border-solid border-gray-300 rounded-md px-4 py-1 cursor-pointer">
                            <EllipsisMiddle suffixCount={10}>{file ? file.name : "drop or click"}</EllipsisMiddle>
                        </div>
                    </InputFile>
                    <Button
                        disabled={bidMutation.isLoading || uploadFileMutation.isLoading}
                        loading={bidMutation.isLoading || uploadFileMutation.isLoading}
                        onClick={onClickSend}
                        htmlType="button"
                        type="primary"
                    >
                        Send
                    </Button>
                </div>
            </Modal>
            {children({ showModal, handleCancel })}
        </>
    );
}

export default ModalApplication;
