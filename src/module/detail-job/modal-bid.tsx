import { Button, Checkbox, Form, message, Modal, Space } from "antd";
import ControlledInputRichText from "components/form/controlled-inputs/controlled-input-rich-text";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import { useMutation } from "react-query";
import heroService from "services/hero";
import authService from "services/auth";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import Utils from "utils";

type Props = {
    idPoster: string;
    isFixedPrice: boolean;
    refetchQuery: () => void;
    children: (dt: { showModal: () => void; handleCancel: () => void }) => any;
};

interface BidLetter {
    letter: string;
    price?: string;
}

const schema: yup.SchemaOf<BidLetter> = yup.object().shape({
    letter: yup.string().required("Letter bid is required!"),
    price: yup.string(),
});

function ModalBid({ children, isFixedPrice, idPoster, refetchQuery }: Props) {
    const user = authService.CurrentUser();
    const [form] = Form.useForm();

    const [bargain, setBargain] = useState<boolean>(false);

    const {
        handleSubmit,
        control,
        formState: { isValid },
        watch,
        setError,
    } = useForm<BidLetter>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const letter = watch("letter");
    const price = watch("price");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const bidMutation = useMutation(
        async (bid: any) => {
            await heroService.SendBid({ pid: idPoster, uid: user?.uid as any, data: bid });
        },
        {
            onSuccess: () => {
                refetchQuery();
                setIsModalOpen(false);
                message.success("Offer sent successfully");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const handleCancel = () => {
        if (bidMutation.isLoading) return;
        setIsModalOpen(false);
    };

    const onSubmitHandler = handleSubmit((data) => {
        if (!Utils.stripHtml(letter)) {
            setError("letter", {
                message: "Letter is required!",
                type: "required",
            });
            return;
        }
        if (bargain && !price) {
            setError("price", {
                message: "Bargain price is required!",
                type: "required",
            });
            return;
        }
        bidMutation.mutate({
            ...data,
            price: bargain ? data.price : null,
        });
    });

    const onChange = (e: CheckboxChangeEvent) => {
        setBargain(e.target.checked);
    };

    return (
        <>
            <Modal width={800} footer={null} title="Bid Letter" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    colon={false}
                    style={{ width: "100%" }}
                    layout="horizontal"
                    onFinish={onSubmitHandler}
                >
                    <ControlledInputRichText control={control} name="letter" placeholder="Make it as interesting as possible" label="" className="" />
                    <div className="flex items-start justify-between w-full mt-10">
                        {isFixedPrice ? (
                            <p className="m-0 capitalize text-gray-400">the price is fixed</p>
                        ) : (
                            <Space direction="vertical">
                                <Checkbox checked={bargain} onChange={onChange}>
                                    Bargain
                                </Checkbox>
                                {bargain && <ControlledInputNumber control={control} name="price" label="" placeholder="" className="!w-[300px]" />}
                            </Space>
                        )}
                        <Button loading={bidMutation.isLoading} disabled={bidMutation.isLoading} htmlType="submit" type="primary">
                            Send
                        </Button>
                    </div>
                </Form>
            </Modal>
            {children({ showModal, handleCancel })}
        </>
    );
}

export default ModalBid;
