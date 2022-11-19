import { Alert, Button, Form, message } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "components/common/layout";
import React from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { FDataPost } from "module/create-post/models";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import ControlledRadioInput from "components/form/controlled-inputs/controlled-input-radio";
import { DEFAULT_ERROR, FIXED_PRICE, TASK_JOB, TYPE_OF_JOBS, TYPE_PRICES } from "utils/constant";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import ControlledInputRichText from "components/form/controlled-inputs/controlled-input-rich-text";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import { useMutation } from "react-query";
import { Poster } from "models";
import { useNavigate } from "react-router-dom";
import ownerService from "services/owner";
import authService from "services/auth";

const schema: yup.SchemaOf<FDataPost> = yup.object().shape({
    title: yup.string().required("Service title is required!"),
    price: yup.string(),
    company: yup.string(),
    is_fixed_price: yup.string(),
    category: yup.string().required("Category is required!"),
    description: yup.string().required("Description is required!"),
    skills: yup.array().required("Skills is required!"),
    type_of_job: yup.string().required("Type of job is required!"),
    number_of_hero: yup.number(),
    limit_applicant: yup.number(),
});

const optionsCategory = [
    {
        value: 1,
        label: "satu",
    },
    {
        value: 2,
        label: "dua",
    },
];

function CreatePost() {
    const navigate = useNavigate();
    const user = authService.CurrentUser();

    const [form] = Form.useForm();

    const {
        handleSubmit,
        control,
        formState: { isValid },
        watch,
        setError,
    } = useForm<FDataPost>({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            number_of_hero: 1,
            limit_applicant: 1,
        },
    });

    const typeOfJob = watch("type_of_job");
    const price = watch("price");
    const isFixedPrice = watch("is_fixed_price");
    const numberOfHero = watch("number_of_hero");

    const description = watch("description");

    const limitApplicant = watch("limit_applicant");
    const company = watch("company");

    const createPostMutation = useMutation(
        async (data: Poster) => {
            const req = await ownerService.CreatePoster({ uid: user?.uid as any, data });
            return req;
        },
        {
            onSuccess: () => {
                message.success("Your job/task posting is On Air!");
                navigate("/");
            },
            onError: (err: any) => {
                message.error(err?.message || DEFAULT_ERROR);
            },
        }
    );

    const onSubmitHandler = handleSubmit((data) => {
        if (parseInt(typeOfJob, 10) === TASK_JOB) {
            if (!price) {
                setError("price", {
                    message: "Price is required!",
                    type: "required",
                });
                return;
            }
            if (!isFixedPrice) {
                setError("is_fixed_price", {
                    message: "Price type is required!",
                    type: "required",
                });
                return;
            }
            if (!numberOfHero) {
                setError("number_of_hero", {
                    message: "Number of hero is required!",
                    type: "required",
                });
                return;
            }
        } else {
            if (!limitApplicant) {
                setError("limit_applicant", {
                    message: "Price type is required!",
                    type: "required",
                });
                return;
            }
            if (!company) {
                setError("company", {
                    message: "Company is required!",
                    type: "required",
                });
                return;
            }
        }

        if (!description) {
            setError("description", {
                message: "Description is required!",
                type: "required",
            });
            return;
        }

        createPostMutation.mutate({
            ...data,
            is_fixed_price: data.is_fixed_price ? parseInt(data.is_fixed_price, 10) === FIXED_PRICE : false,
            type_of_job: parseInt(data.type_of_job, 10) === TASK_JOB ? "task" : "hiring",
        } as Poster);
    });

    const onClickGuide = () => {};

    return (
        <Layout>
            <div className="w-full">
                <div className="flex items-center my-4">
                    <p className="m-0 mr-2 font-semibold text-xl capitalize">create post</p>
                    <AiFillQuestionCircle className="text-gray-400 text-xl cursor-pointer" onClick={onClickGuide} />
                </div>
                <div className="mt-10 w-full bg-white rounded-md border-solid border border-gray-300 p-6">
                    <Form
                        form={form}
                        labelCol={{ span: 3 }}
                        labelAlign="left"
                        colon={false}
                        style={{ width: "100%" }}
                        layout="horizontal"
                        onFinish={onSubmitHandler}
                    >
                        <ControlledInputText
                            control={control}
                            labelCol={{ xs: 5 }}
                            name="title"
                            label="Post Title"
                            placeholder="Convert PDF layout to HTML/CSS"
                            className=""
                        />
                        <ControlledRadioInput
                            control={control}
                            labelCol={{ xs: 5 }}
                            name="type_of_job"
                            label="Type Of Job"
                            className=""
                            options={TYPE_OF_JOBS}
                        />
                        {parseInt(typeOfJob, 10) === TASK_JOB ? (
                            <>
                                <ControlledInputNumber
                                    control={control}
                                    labelCol={{ xs: 5 }}
                                    name="price"
                                    label="Price"
                                    placeholder=""
                                    className=""
                                />
                                <ControlledRadioInput
                                    control={control}
                                    labelCol={{ xs: 5 }}
                                    name="is_fixed_price"
                                    label=" "
                                    className=""
                                    options={TYPE_PRICES}
                                />
                            </>
                        ) : (
                            <ControlledInputText
                                control={control}
                                labelCol={{ xs: 5 }}
                                name="company"
                                label="Company"
                                placeholder="Your company"
                                className=""
                            />
                        )}
                        <ControlledInputRichText
                            labelCol={{ xs: 5 }}
                            control={control}
                            name="description"
                            placeholder="Your post description"
                            label="Description"
                            className=""
                        />
                        <ControlledSelectInput
                            control={control}
                            name="category"
                            labelCol={{ xs: 5 }}
                            label="Category"
                            placeholder="Category"
                            className=""
                            options={optionsCategory}
                        />

                        <ControlledSelectInput
                            mode="tags"
                            control={control}
                            name="skills"
                            labelCol={{ xs: 5 }}
                            label="Skills"
                            placeholder="Skills needed"
                            className=""
                            options={[]}
                        />
                        {parseInt(typeOfJob, 10) === TASK_JOB ? (
                            <ControlledInputText
                                type="number"
                                control={control}
                                labelCol={{ xs: 5 }}
                                name="number_of_hero"
                                label="Number of hero"
                                placeholder=""
                                className=""
                            />
                        ) : (
                            <ControlledInputText
                                type="number"
                                control={control}
                                labelCol={{ xs: 5 }}
                                name="limit_applicant"
                                label="Limit Applicant"
                                placeholder=""
                                className=""
                            />
                        )}

                        <Button loading={createPostMutation.isLoading} htmlType="submit" type="primary" className="mt-10">
                            Post
                        </Button>
                    </Form>
                    {createPostMutation.isError && <Alert message={createPostMutation.error || createPostMutation.error?.message} type="error" />}
                </div>
            </div>
        </Layout>
    );
}

export default CreatePost;
