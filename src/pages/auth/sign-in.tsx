import { Alert, Button, Divider, Form, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { BsGoogle } from "react-icons/bs";
import authService from "services/auth";

import HerokuImage from "assets/svgs/heroku-image.svg";

import { SignInEmail } from "models";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SIGN_UP_PATH } from "utils/routes";
import { Link } from "react-router-dom";
import userService from "services/user";

const schema: yup.SchemaOf<SignInEmail> = yup.object().shape({
    email: yup.string().required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
});

function SignIn() {
    const [form] = Form.useForm();

    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<SignInEmail>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const signinMutation = useMutation(async (data: SignInEmail) => {
        const req = await authService.SignInEmail(data);
        return req;
    });

    const signinGoogleMutation = useMutation(async () => {
        const signin = await authService.SignInGoogle();
        const user = await userService.GetUser(signin.user.uid);
        if (!user) {
            await userService.CreateUser({
                profile: signin.user.photoURL || "",
                name: signin.user.displayName || "",
                uid: signin.user.uid,
            });
        }
    });

    const onSubmitHandler = handleSubmit((data) => {
        signinMutation.mutate(data);
    });

    const clickSignInGoogleHandler = () => {
        signinGoogleMutation.mutate();
    };

    return (
        <div className="CONTAINER grid grid-cols-1 md:grid-cols-2 items-center min-h-screen">
            <div className="flex-1">
                <img src={HerokuImage} alt="heroku" className="w-full md:w-auto" />
            </div>
            <div className="flex-1 flex flex-col items-center">
                <div className="max-w-[400px] lg:w-[500px]">
                    <p className="font-semibold text-primary text-2xl capitalize">sign in</p>
                    <Form
                        form={form}
                        labelCol={{ span: 3 }}
                        labelAlign="left"
                        colon={false}
                        style={{ width: "100%" }}
                        layout="vertical"
                        onFinish={onSubmitHandler}
                    >
                        <Space direction="vertical" className="w-full">
                            <ControlledInputText
                                control={control}
                                name="email"
                                labelCol={{ xs: 24 }}
                                label=""
                                placeholder="Email"
                                className="INPUT-GRAY"
                            />
                            <ControlledInputText
                                control={control}
                                name="password"
                                labelCol={{ xs: 24 }}
                                label=""
                                placeholder="Password"
                                className="INPUT-GRAY"
                                type="password"
                            />
                        </Space>
                        <Space>
                            <Button
                                loading={signinMutation.isLoading}
                                htmlType="submit"
                                disabled={!isValid || signinMutation.isLoading}
                                type="primary"
                                className="BUTTON-PRIMARY"
                            >
                                sign in
                            </Button>
                            <Link to={SIGN_UP_PATH}>Create account</Link>
                        </Space>
                    </Form>
                    <Divider plain className="!text-gray-400">
                        Or signin with google
                    </Divider>
                    <Button
                        onClick={clickSignInGoogleHandler}
                        type="primary"
                        className="!items-center !mb-3 !justify-center !flex BUTTON-PRIMARY !px-7 !py-5 !w-full"
                    >
                        <BsGoogle />
                        <p className="capitalize m-0 ml-3">continue with google</p>
                    </Button>
                    {signinMutation.isError && <Alert message={(signinMutation.error as any)?.message || signinMutation.error} type="error" />}
                    {signinGoogleMutation.isError && (
                        <Alert message={(signinGoogleMutation.error as any)?.message || signinGoogleMutation.error} type="error" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignIn;
