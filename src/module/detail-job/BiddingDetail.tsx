import { Button, Card, Layout } from "antd";
import { Bid, Poster } from "models";
import React, { useEffect, useState } from "react";
import BidModal from "./BidModal";
import { BidType } from "./models";

interface Props {
    job: Poster;
    bid?: Bid;
}

function BiddingDetail({ job, bid }: Props) {
    const [bidLetter, setBidLetter] = useState<Bid | undefined>(bid);
    const [openModal, setOpenModal] = useState<boolean>(false);

    // Mock loading
    const [loadingModal, setLoadingModal] = useState<boolean>(false);

    const handleOk = (description: any, price: any) => {
        // const letter: Bid = {
        //     accept: false,
        //     date: new Date().getTime(),
        //     description: description as any,
        //     price,
        //     id: "testing",
        //     hid: "",
        //     pid: "",
        //     status: 1,
        //     uid: "uidtesting",
        // };
        // setLoadingModal(true);
        // setTimeout(() => {
        //     setBidLetter(letter);
        //     setLoadingModal(false);
        //     setOpenModal(false);
        // }, 3000);
    };

    const handleCancel = () => {
        setOpenModal(false);
    };

    const onBidClick = () => {
        setOpenModal(true);
    };

    if (job.type_of_job === "hiring") {
        return (
            <>
                <br />
                <Card>
                    <div>
                        <p className="text-16 font-medium mb-0">{job?.title}</p>
                        <p className="font-medium mb-3">{job.company}</p>
                    </div>
                    <div className="flex mb-5 flex-col">
                        <p className="font-medium m-0">Owner</p>
                        <p className="text-12 text-gray-500 m-0">{job?.date}</p>
                    </div>
                    <p className="font-semibold text-16">{job?.price}</p>
                    <p className="text-gray-400">{job?.description}</p>
                    <div className="flex flex-col">
                        <p className="font-medium m-0">Type of job</p>
                        <p className="text-gray-400">{job?.type_of_job}</p>
                    </div>
                    <div className="flex mb-4">
                        <div className="flex flex-col w-1/2">
                            <p className="font-medium m-0">Category</p>
                            <p className="inline-block my-1 px-7 py-2 bg-gray-100 text-gray-500 rounded-full w-fit">{job?.category}</p>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <p className="font-medium m-0">Skills</p>
                            <div className="w-full flex flex-wrap ">
                                {job?.skills.map((skill) => (
                                    <p key={skill} className="inline-block my-1 mx-2 px-7 py-2 bg-gray-100 text-gray-500 rounded-full w-fit">
                                        {skill}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="m-0 font-medium">{`${job?.number_of_hero} Heroes apply this post`}</p>
                </Card>
                {!bidLetter && (
                    <div className="flex justify-end">
                        <Button onClick={onBidClick} className="my-5" type="primary">
                            Apply
                        </Button>
                        <BidModal loading={loadingModal} open={openModal} handleCancel={handleCancel} handleOk={handleOk} />
                    </div>
                )}

                <br />
                {bidLetter && (
                    <Card>
                        <p className="text-16 font-medium mb-2">Application Letter</p>
                        {/* <p className="text-gray-400">{`${bidLetter.description}`}</p> */}
                    </Card>
                )}
            </>
        );
    }

    return (
        <>
            <br />
            <Card>
                <p className="text-16 font-medium mb-2">{job?.title}</p>
                <div className="flex mb-5 flex-col">
                    <p className="font-medium m-0">Owner</p>
                    <p className="text-12 text-gray-500 m-0">{job?.date}</p>
                </div>
                <p className="font-semibold text-16">{job?.price}</p>
                <p className="text-gray-400">{job?.description}</p>
                <div className="flex flex-col">
                    <p className="font-medium m-0">Type of job</p>
                    <p className="text-gray-400">{job?.type_of_job}</p>
                </div>
                <div className="flex mb-4">
                    <div className="flex flex-col w-1/2">
                        <p className="font-medium m-0">Category</p>
                        <p className="inline-block my-1 px-7 py-2 bg-gray-100 text-gray-500 rounded-full w-fit">{job?.category}</p>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <p className="font-medium m-0">Skills</p>
                        <div className="w-full flex flex-wrap ">
                            {job?.skills.map((skill) => (
                                <p key={skill} className="inline-block my-1 mx-2 px-7 py-2 bg-gray-100 text-gray-500 rounded-full w-fit">
                                    {skill}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="m-0 font-medium">{`${job?.number_of_hero} Heroes bid this post`}</p>
            </Card>
            {!bidLetter && (
                <div className="flex justify-end">
                    <Button onClick={onBidClick} className="my-5" type="primary">
                        Bid
                    </Button>
                    <BidModal
                        loading={loadingModal}
                        open={openModal}
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        isFixedPrice={job?.is_fixed_price}
                    />
                </div>
            )}

            <br />
            {bidLetter && (
                <Card>
                    <p className="text-16 font-medium mb-2">Bid Letter</p>
                    {/* <p className="text-gray-400">{`${bidLetter.description}`}</p> */}
                </Card>
            )}
        </>
    );
}

export default BiddingDetail;
