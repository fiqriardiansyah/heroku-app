import { Button, Form, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ControlledInputRichText from "components/form/controlled-inputs/controlled-input-rich-text";
import Utils from "utils";
import { FDataExplainIt } from "./models";

const schema: yup.SchemaOf<FDataExplainIt> = yup.object().shape({
    description: yup.string().required("Service description is required!"),
});

type Props = {
    nextStep: () => void;
    prevStep: () => void;
    onSubmit: (dt: FDataExplainIt) => void;
    currentData: FDataExplainIt | null;
};

function ExplainitForm({ nextStep, prevStep, onSubmit, currentData }: Props) {
    const [form] = Form.useForm();

    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        watch,
    } = useForm<FDataExplainIt>({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: currentData
            ? {
                  ...currentData,
              }
            : {},
    });

    const description = watch("description");

    useEffect(() => {
        if (currentData) {
            setValue("description", currentData.description);
        }
    }, [currentData]);

    const onSubmitHandler = handleSubmit((data) => {
        onSubmit(data);
        nextStep();
    });

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
                <ControlledInputRichText
                    control={control}
                    name="description"
                    placeholder="Your service description"
                    label="Description"
                    className=""
                />
                <span className="m-0 text-gray-300 text-xs">
                    Explain in detail what you offer/deliver in this service. can start from service details, advantages, delivery time and so on
                </span>
                <div className="flex items-center justify-between mt-5">
                    <Button htmlType="submit" type="primary" className="BUTTON-PRIMARY" onClick={prevStep}>
                        prev
                    </Button>
                    <Button htmlType="submit" type="primary" disabled={!isValid || !Utils.stripHtml(description)} className="BUTTON-PRIMARY">
                        next
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default ExplainitForm;
