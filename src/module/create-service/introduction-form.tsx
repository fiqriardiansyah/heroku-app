import { Button, Form, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import { FDataIntroduction } from "./models";

const schema: yup.SchemaOf<FDataIntroduction> = yup.object().shape({
    title: yup.string().required("Service title is required!"),
    price: yup.string().required("price is required!"),
    category: yup.string().required("Category is required!"),
    sub_category: yup.string().required("Sub category is required!"),
    tags: yup.array().required("Tags is required!"),
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

type Props = {
    nextStep: () => void;
    onSubmit: (dt: FDataIntroduction) => void;
    currentData: FDataIntroduction | null;
};

function IntroductionForm({ nextStep, onSubmit, currentData }: Props) {
    const [form] = Form.useForm();

    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        watch,
    } = useForm<FDataIntroduction>({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: currentData
            ? {
                  ...currentData,
              }
            : {},
    });

    const watchAll = watch();

    useEffect(() => {
        if (currentData) {
            setValue("title", currentData.title);
            setValue("price", currentData.price);
            setValue("category", currentData.category);
            setValue("sub_category", currentData.sub_category);
            setValue("tags", currentData.tags);
        }
    }, [currentData]);

    const onSubmitHandler = handleSubmit((data) => {
        onSubmit(data);
        nextStep();
    });

    const isAllValid = useMemo(() => {
        const { title, category, price, sub_category: subCategory, tags } = watchAll;
        if (!title || !category || !subCategory || !tags || tags.length === 0 || !price) return false;
        return true;
    }, [watchAll]);

    return (
        <div className="w-full">
            <Form
                form={form}
                labelCol={{ span: 3 }}
                labelAlign="left"
                colon={false}
                style={{ width: "100%" }}
                layout="horizontal"
                onFinish={onSubmitHandler}
            >
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    <div className="">
                        <div className="">
                            <span className="m-0 text-gray-300 text-xs">
                                The title of this service will be the first to be seen by others, make good use of it
                            </span>
                            <ControlledInputText
                                control={control}
                                labelCol={{ xs: 5 }}
                                name="title"
                                label="Service Title"
                                placeholder="I can make ..."
                                className=""
                            />
                        </div>
                        <div className="">
                            <span className="m-0 text-gray-300 text-xs">Select the category of work field and fill in the specific field</span>
                            <div className="w-full flex items-center">
                                <ControlledSelectInput
                                    control={control}
                                    name="category"
                                    labelCol={{ xs: 10 }}
                                    label="Category"
                                    placeholder="Category"
                                    className=""
                                    options={optionsCategory}
                                />
                                <div className="w-4" />
                                <ControlledInputText control={control} name="sub_category" label="" placeholder="Ex: web development" className="" />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="">
                            <span className="m-0 text-gray-300 text-xs">Make a good price</span>
                            <ControlledInputNumber labelCol={{ xs: 5 }} control={control} name="price" label="Price" placeholder="" className="" />
                        </div>
                        <div className="">
                            <span className="m-0 text-gray-300 text-xs">By tagging will help potential buyers find your services</span>
                            <ControlledSelectInput
                                mode="tags"
                                control={control}
                                name="tags"
                                labelCol={{ xs: 5 }}
                                label="Tags"
                                placeholder="Tags"
                                className=""
                                options={[]}
                            />
                        </div>
                    </div>
                </div>
                <Button htmlType="submit" disabled={!isAllValid} type="primary" className="BUTTON-PRIMARY">
                    next
                </Button>
            </Form>
        </div>
    );
}

export default IntroductionForm;
