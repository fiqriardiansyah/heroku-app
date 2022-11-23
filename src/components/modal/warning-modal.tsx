import { Alert, Button, Modal, Space } from "antd";
import React, { useState } from "react";
import Utils from "utils";

type Props = {
    onOk: () => void;
    children: (dt: { showModal: () => void; handleCancel: () => void }) => any;
};

function WarningModal({ children, onOk }: Props) {
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

    const onOkeClickHandler = () => {
        onOk();
        handleCancel();
    };

    return (
        <>
            <Modal footer={null} title="Caution" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="w-full flex flex-col">
                    <Space direction="vertical">
                        <Alert
                            showIcon
                            type="warning"
                            message="Beware"
                            description="Be careful of fraud, do not provide personal information such as telephone numbers, id cards and others"
                        />
                        <p className="m-0 text-red-400 text-xs">
                            Due to limited resources and other things, for now Heroku cannot provide, handle and protect all kinds of transactions
                            made by paying parties and paid parties
                        </p>
                    </Space>
                    <div className="w-full flex items-center justify-between mt-6">
                        <p />
                        <Button onClick={onOkeClickHandler} type="primary">
                            Accept
                        </Button>
                    </div>
                </div>
            </Modal>
            {children({ showModal, handleCancel })}
        </>
    );
}

export default WarningModal;
