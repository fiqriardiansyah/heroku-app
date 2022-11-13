import { Button, Form, Space } from "antd";
import ButtonFileUpload from "components/button/file-upload";
import InputFile from "components/form/inputs/input-file";
import React, { useState } from "react";
import { FDataConvince } from "./models";

type Props = {
    nextStep: () => void;
    prevStep: () => void;
    onSubmit: (dt: FDataConvince) => void;
    currentData: FDataConvince | null;
};

function ConvinceForm({ nextStep, prevStep, onSubmit, currentData }: Props) {
    const [images, setImages] = useState<File[]>(currentData?.images || []);
    const [pdfs, setPdfs] = useState<File[]>(currentData?.pdfs || []);

    const addImage = (file: File) => {
        if (images.find((img) => img.name === file.name)) return;
        setImages((prev) => [...prev, file]);
    };

    const addPdf = (file: File) => {
        if (pdfs.find((pdf) => pdf.name === file.name)) return;
        setPdfs((prev) => [...prev, file]);
    };

    const deleteImage = (file: File | undefined) => {
        if (!file) return;
        setImages((prev) => [...prev].filter((img) => img.name !== file.name));
    };

    const deletePdf = (file: File | undefined) => {
        if (!file) return;
        setPdfs((prev) => [...prev].filter((pdf) => pdf.name !== file.name));
    };

    const onClickNext = () => {
        onSubmit({
            images,
            pdfs,
        });
        nextStep();
    };

    return (
        <div className="w-full">
            <p className="capitalize">
                images{" "}
                <span className="m-0 ml-5 text-gray-300 text-xs">
                    Get noticed by the right buyers with visual examples of your services. First image will be this service poster image
                </span>
            </p>
            <Space direction="horizontal">
                {images.map((image) => (
                    <ButtonFileUpload onClickRemove={deleteImage} mode="remove" key={image.name} file={image} />
                ))}
                {images.length < 3 && (
                    <InputFile handleChange={addImage} name="image" types={["png", "jpeg", "jpg", "webp"]}>
                        <ButtonFileUpload mode="add" />
                    </InputFile>
                )}
            </Space>
            <p className="capitalize mt-10">Pdfs</p>
            <Space direction="horizontal">
                {pdfs.map((pdf) => (
                    <ButtonFileUpload onClickRemove={deletePdf} mode="remove" key={pdf.name} file={pdf} />
                ))}
                {pdfs.length < 3 && (
                    <InputFile handleChange={addPdf} name="image" types={["pdf"]}>
                        <ButtonFileUpload mode="add" />
                    </InputFile>
                )}
            </Space>
            <div className="flex items-center justify-between mt-5">
                <Button htmlType="submit" type="primary" className="BUTTON-PRIMARY" onClick={prevStep}>
                    prev
                </Button>
                <Button disabled={images.length === 0} htmlType="submit" type="primary" className="BUTTON-PRIMARY" onClick={onClickNext}>
                    next
                </Button>
            </div>
        </div>
    );
}

export default ConvinceForm;
