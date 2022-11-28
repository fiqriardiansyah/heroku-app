import { Alert, Button, Input, message, Modal, Rate, Space } from "antd";
import { User as UserFirebase } from "firebase/auth";
import { Poster, Review, Service, User } from "models";
import React, { useState } from "react";
import { useMutation, UseQueryResult } from "react-query";
import Utils from "utils";
import { RATE_DESC } from "utils/constant";

type Props = {
    header?: React.ReactNode;
    onOk: (review: Partial<Review>) => void;
    onCancel?: () => void;
    children: (dt: { showModal: () => void; handleCancel: () => void }) => any;
};

function ReviewModal({ children, onOk, header, onCancel }: Props) {
    const [rate, setRate] = useState(0);
    const [review, setReview] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        if (onCancel) {
            onCancel();
        }
    };

    const onOkeClickHandler = () => {
        const dataReview: Partial<Review> = {
            date: new Date().getTime(),
            rate,
            review,
        };
        onOk(dataReview);
        handleCancel();
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setReview(e.target.value);
    };

    return (
        <>
            <Modal footer={null} title="Review" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="w-full flex flex-col">
                    {header && header}
                    <div className="h-10" />
                    <Rate allowHalf className="self-center scale-150" tooltips={RATE_DESC} onChange={setRate} value={rate} />
                    <div className="h-5" />
                    <Input.TextArea
                        showCount
                        maxLength={200}
                        value={review}
                        placeholder="Your honest review"
                        size="middle"
                        allowClear
                        onChange={onChange}
                    />
                    <div className="w-full flex items-center justify-between mt-6">
                        <p />
                        <Button disabled={!rate} onClick={onOkeClickHandler} type="primary">
                            Send Review
                        </Button>
                    </div>
                </div>
            </Modal>
            {children({ showModal, handleCancel })}
        </>
    );
}

export default ReviewModal;
