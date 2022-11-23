import { Image, Form, Button, Skeleton, message, Space, Alert } from "antd";
import Layout from "components/common/layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import authService from "services/auth";
import { IMAGE_FALLBACK } from "utils/constant";
import { FDataUser } from "module/profile/models";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { UserContext } from "context/user";
import InputFile from "components/form/inputs/input-file";
import Utils from "utils";
import State from "components/common/state";
import { useMutation } from "react-query";
import { User } from "models";
import userService from "services/user";
import fileService from "services/file";
import HistoryCard from "module/profile/history-card";

const schema: yup.SchemaOf<FDataUser> = yup.object().shape({
    name: yup.string().required("Name is required!"),
    profile: yup.string(),
    profession: yup.string().required("Profession is required!"),
});

function Profile() {
    const user = authService.CurrentUser();
    const { state } = useContext(UserContext);
    const [file, setFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const [form] = Form.useForm();

    const { handleSubmit, control, setValue } = useForm<FDataUser>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

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

    const userMutation = useMutation(
        async (data: Partial<User>) => {
            await userService.UpdateUser(data as User);
        },
        {
            onSuccess: () => {
                message.success("Updated profile!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onSubmitHandler = handleSubmit(async (data) => {
        if (file) {
            const url = await uploadFileMutation.mutateAsync(file);
            userMutation.mutate({
                ...data,
                profile: url,
                uid: user?.uid,
            });
            return;
        }
        userMutation.mutate({
            ...data,
            uid: user?.uid,
        });
    });

    useEffect(() => {
        if (file) {
            Utils.getBase64(file, (base64) => {
                setImageBase64(base64);
            });
        }
    }, [file]);

    useEffect(() => {
        form.setFieldsValue({
            name: state.user?.name,
            profession: state.user?.profession || "",
        });
        setValue("name", state.user?.name || "");
        setValue("profession", state.user?.profession || "");
    }, [state.user]);

    const handleImageChange = (fl: File) => {
        setFile(fl);
    };

    return (
        <Layout useFooter={false}>
            <div className="w-full pt-10">
                <div className="bg-white w-full min-h-90vh border rounded-xl border-solid border-gray-300 flex">
                    <div className="flex-1 p-4">
                        <p className="m-0 capitalize text-lg mb-10">profile</p>
                        <State data={state.user} isLoading={!state.user}>
                            {(st) => (
                                <>
                                    <State.Data state={st}>
                                        <div className="px-5">
                                            <InputFile handleChange={handleImageChange} types={["png", "jpeg", "jpg", "webp"]} name="profile">
                                                <Image
                                                    preview={false}
                                                    referrerPolicy="no-referrer"
                                                    fallback={IMAGE_FALLBACK}
                                                    src={imageBase64 || state.user?.profile || undefined}
                                                    width={200}
                                                    height={200}
                                                    placeholder={
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                                            <FaUserAlt className="text-6xl text-gray-400" />
                                                        </div>
                                                    }
                                                    className="flex-1 bg-gray-200 rounded-md object-cover cursor-pointer"
                                                />
                                            </InputFile>
                                            <p className="mt-7 mb-4 text-gray-400">{user?.email}</p>
                                            <Form
                                                form={form}
                                                labelCol={{ span: 3 }}
                                                labelAlign="left"
                                                colon={false}
                                                style={{ width: "100%" }}
                                                layout="horizontal"
                                                onFinish={onSubmitHandler}
                                            >
                                                <ControlledInputText control={control} name="name" label="" placeholder="Your name" className="" />
                                                <ControlledInputText
                                                    control={control}
                                                    name="profession"
                                                    label=""
                                                    placeholder="Your profession"
                                                    className=""
                                                />
                                                <Button
                                                    loading={uploadFileMutation.isLoading || userMutation.isLoading}
                                                    htmlType="submit"
                                                    type="primary"
                                                    className="mt-5"
                                                >
                                                    Save
                                                </Button>
                                            </Form>
                                        </div>
                                    </State.Data>
                                    <State.Loading state={st}>
                                        <Skeleton.Image active />
                                        <Skeleton paragraph={{ rows: 5 }} active className="mt-4" />
                                    </State.Loading>
                                </>
                            )}
                        </State>
                    </div>
                    <div className="flex-1 p-4">
                        <p className="m-0 capitalize text-lg mb-10">transaction</p>
                        <Space direction="vertical">
                            <Alert
                                showIcon
                                type="warning"
                                description="Due to limited resources and other things, for now Heroku cannot provide, handle and protect all kinds of transactions made by paying parties and paid parties"
                            />
                        </Space>
                        <p className="m-0 capitalize text-lg mb-10 mt-5">History</p>
                        <div className="flex flex-col w-full max-h-[400px] overflow-auto px-4">
                            <HistoryCard />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
