import { Button, InputNumber, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";

export default function BidModal({
    open,
    handleOk,
    handleCancel,
    loading,
    isFixedPrice = true,
}: {
    open: boolean;
    handleOk: any;
    handleCancel: any;
    loading: boolean;
    isFixedPrice?: boolean;
}) {
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const onPriceChange = (e: any) => {
        setPrice(e);
    };
    const onDescriptionChange = (e: any) => {
        setDescription(`${e.target.value}`);
    };
    return (
        <Modal
            open={open}
            title="Letter"
            onOk={(e) => handleOk(description, price)}
            onCancel={handleCancel}
            width={972}
            footer={[
                <div key="modal" className="flex w-full justify-end gap-3">
                    {!isFixedPrice && (
                        <InputNumber prefix="Rp. " onChange={onPriceChange} placeholder="1000" type="number" style={{ width: "45%" }} value={price} />
                    )}
                    <div className="flex-grow"> </div>
                    <Button key="submit" type="primary" loading={loading} onClick={(e) => handleOk(description, price)}>
                        Submit
                    </Button>
                </div>,
            ]}
        >
            <TextArea onChange={onDescriptionChange} value={description} rows={6} />
        </Modal>
    );
}
