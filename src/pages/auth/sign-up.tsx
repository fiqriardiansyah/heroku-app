import { Alert, Button, Divider, Form, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { BsGoogle } from "react-icons/bs";
import authService from "services/auth";

import HerokuImage from "assets/svgs/heroku-image.svg";

import { SignUpEmail } from "models";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SIGN_IN_PATH } from "utils/routes";
import { Link } from "react-router-dom";

const schema: yup.SchemaOf<SignUpEmail> = yup.object().shape({
    email: yup.string().required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
});

function SignUp() {
    const [form] = Form.useForm();

    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<SignUpEmail>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const signupMutation = useMutation(async (data: SignUpEmail) => {
        const req = await authService.SignUpEmail(data);
        return req;
    });

    const signinGoogleMutation = useMutation(async () => {
        const req = await authService.SignInGoogle();
        return req;
    });

    const onSubmitHandler = handleSubmit((data) => {
        signupMutation.mutate(data);
    });

    const clickSignInGoogleHandler = () => {
        signinGoogleMutation.mutate();
    };

    return (
        <div className="CONTAINER flex items-center min-h-screen">
            <div className="flex-1">
                <img src={HerokuImage} alt="heroku" />
            </div>
            <div className="flex-1 flex flex-col items-center">
                <div className="max-w-[400px] lg:w-[500px]">
                    <p className="font-semibold text-primary text-2xl capitalize">
                        sign up
                    </p>
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
                                loading={signupMutation.isLoading}
                                htmlType="submit"
                                disabled={!isValid || signupMutation.isLoading}
                                type="primary"
                                className="BUTTON-PRIMARY"
                            >
                                sign up
                            </Button>
                            <Link to={SIGN_IN_PATH}>
                                Already have an account?
                            </Link>
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
                        <p className="capitalize m-0 ml-3">
                            continue with google
                        </p>
                    </Button>
                    {signupMutation.isError && (
                        <Alert
                            message={
                                (signupMutation.error as any)?.message ||
                                signupMutation.error
                            }
                            type="error"
                        />
                    )}
                    {signinGoogleMutation.isError && (
                        <Alert
                            message={
                                (signinGoogleMutation.error as any)?.message ||
                                signinGoogleMutation.error
                            }
                            type="error"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignUp;
