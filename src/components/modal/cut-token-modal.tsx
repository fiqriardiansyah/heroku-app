import { Button, Modal } from "antd";
import React, { useState } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import Utils from "utils";
import { VALUE_TOKEN } from "utils/constant";

type Props = {
    leftToken: number;
    total: number;
    children: (dt: { showModal: () => void; handleCancel: () => void }) => any;
};

function CutTokenModal({ children, total, leftToken }: Props) {
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

    return (
        <>
            <Modal footer={null} title="Payment" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="w-full flex flex-col">
                    <p className="capitalize text-gray-300">payment</p>
                    <h1 className="text-primary text-3xl text-center mt-10">{total.ToIndCurrency("Rp")}</h1>
                    <p className="text-gray-400 capitalize text-center mb-10">
                        it will be {Utils.convertToToken(total)} token <br />
                        you have {leftToken} token left
                    </p>
                    <div className="w-full flex items-center justify-between ">
                        <p className="text-gray-400 m-0">
                            <RiErrorWarningFill className="mr-2" />1 token represents Rp.{VALUE_TOKEN}
                        </p>
                        <Button type="primary">Pay</Button>
                    </div>
                </div>
            </Modal>
            {children({ showModal, handleCancel })}
        </>
    );
}

export default CutTokenModal;
