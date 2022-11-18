import { Button, Form, message, Modal, Space } from "antd";
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
import { Application, Poster } from "models";
import { IoMdClose } from "react-icons/io";
import ownerService from "services/owner";
import { RiErrorWarningLine } from "react-icons/ri";
import Utils from "utils";

type Props = {
    idApplication: string;
    poster: Poster;
    refetchQuery: () => void;
    children: (dt: { showModal: () => void; handleCancel: () => void }) => any;
};

interface ApplicationLetter {
    description: string;
}

const schema: yup.SchemaOf<ApplicationLetter> = yup.object().shape({
    description: yup.string().required("Letter is required!"),
});

function OfferingModal({ children, refetchQuery, idApplication, poster }: Props) {
    const user = authService.CurrentUser();

    const [form] = Form.useForm();
    const [files, setFiles] = useState<File[]>([]);
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

    const description = watch("description");

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
        if (files.find((f) => f.name === fl.name)) return;
        setFiles((prev) => [...prev, fl]);
    };

    const removeFileHandler = (fl: File) => {
        setFiles((prev) => [...prev].filter((f) => f.name !== fl.name));
    };

    const offeringMutation = useMutation(
        async (application: Partial<Application>) => {
            await ownerService.SendOffering({ apcid: idApplication, application, poster });
        },
        {
            onSuccess: () => {
                refetchQuery();
                setIsModalOpen(false);
                message.success("Offering letter sent successfully");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const uploadFileMutation = useMutation(
        async (fls: File[]) => {
            const requestRefs = await fileService.UploadMultipleFile({ files: fls });
            const urlRefs = [...requestRefs.map((ref) => ref.ref)];
            const urls = await fileService.GetMultipleDownloadUrl({ refs: urlRefs });
            return urls;
        },
        {
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onSubmitHandler = handleSubmit(async (data) => {
        if (files) {
            const urls = await uploadFileMutation.mutateAsync(files);
            offeringMutation.mutate({
                offering_letter: data.description,
                files: urls,
            });
            return;
        }
        offeringMutation.mutate({
            offering_letter: data.description,
        });
    });

    const onClickSend = () => {
        if (btnSubmitRef.current) {
            btnSubmitRef.current.click();
        }
    };

    const contentLetter = Utils.stripHtml(description || "");

    return (
        <>
            <Modal width={800} footer={null} title="Write Offering Letter" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    colon={false}
                    style={{ width: "100%" }}
                    layout="horizontal"
                    onFinish={onSubmitHandler}
                >
                    <ControlledInputRichText control={control} name="description" placeholder="" label="" className="" />
                    <button ref={btnSubmitRef} type="submit" className="hidden">
                        submit
                    </button>
                </Form>
                <div className="flex items-start justify-between w-full mt-10">
                    <Space direction="vertical">
                        {files?.length < 3 && (
                            <InputFile handleChange={handleFileChange} name="document" types={["png", "jpg", "jpeg", "pdf", "zip", "doc", "rar"]}>
                                <div className="bg-gray-200 capitalize border border-solid border-gray-300 rounded-md px-4 py-1 cursor-pointer w-fit">
                                    <EllipsisMiddle suffixCount={10}>drop or click</EllipsisMiddle>
                                </div>
                            </InputFile>
                        )}
                        {files?.map((fl) => (
                            <div className="flex items-center">
                                <div className="capitalize px-4 py-1  w-[200px]">
                                    <EllipsisMiddle suffixCount={10}>{fl.name}</EllipsisMiddle>
                                </div>
                                <IoMdClose className="ml-4 cursor-pointer hover:text-red-400" onClick={() => removeFileHandler(fl)} />
                            </div>
                        ))}
                    </Space>
                    <Button
                        disabled={!contentLetter || offeringMutation.isLoading || uploadFileMutation.isLoading}
                        loading={offeringMutation.isLoading || uploadFileMutation.isLoading}
                        onClick={onClickSend}
                        htmlType="button"
                        type="primary"
                    >
                        Send
                    </Button>
                </div>
                <div className="flex justify-end">
                    <p className="text-red-400 capitalize m-0">
                        <RiErrorWarningLine className="m-0 ml-2" /> send to hire heroes
                    </p>
                </div>
            </Modal>
            {children({ showModal, handleCancel })}
        </>
    );
}

export default OfferingModal;
