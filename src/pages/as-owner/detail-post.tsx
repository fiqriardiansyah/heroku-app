import Layout from "components/common/layout";
import React, { useState } from "react";
import { Button, Card, Modal, Steps } from "antd";
import { FaPaperPlane, FaInfo, FaFile } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";
import { Link } from "react-router-dom";
import { CHAT_PATH } from "utils/routes";

type Props = {
    children: string;
    Wrapper?: any;
};

function DetailPostTextContent(props: any) {
    const { children, Wrapper = "div" } = props;
    return <Wrapper style={{ whiteSpace: "pre-line" }}>{children}</Wrapper>;
}

function DetailPostProfileContent() {
    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-row">
                <img className="w-8 h-8 rounded-full shadow-lg" src="user?.photoURL" alt="" />
                <div className="ml-1">
                    <p className="mb-1 font-bold">user?.name</p>
                    <p className="text-gray-500">
                        {/* {user?.workField}  */}
                        Developer
                    </p>
                </div>
            </div>
        </div>
    );
}

function DetailPostHiringApplicant() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onHireApplicant = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    return (
        <Card className="flex flex-col">
            <div className="flex flex-row place-content-between">
                <h2>Applicant</h2>
                <p className="font-bold">12 Applicants</p>
            </div>
            <Card>
                <div className="flex flex-row place-content-between">
                    <DetailPostProfileContent />
                    <p>12 Nov 2022</p>
                </div>
                <DetailPostTextContent>
                    {`Criteria
                    
                    test aja
                    test aja
                    `}
                </DetailPostTextContent>
                <br />
                {}
                <div className="flex flex-row place-content-between">
                    <div className="flex flex-row ">
                        <FaFile className="w-6 h-6" />
                        <p className="ml-1">test.pdf{}</p>
                    </div>
                    <div className="flex flex-row place-content- gap-2">
                        <Button type="primary" onClick={onHireApplicant}>
                            Hire
                        </Button>
                        <Link to={CHAT_PATH}>
                            <Button type="primary" className="flex rounded-full">
                                <FaPaperPlane />
                            </Button>
                        </Link>
                    </div>
                </div>
                <Modal title="Write Offering Letter" open={isModalOpen} footer={null} width={700}>
                    <div className="flex flex-col justify-start">
                        <textarea className="w-full text-clip rounded-lg" rows={10} cols={30} placeholder="Hi ...">
                            {}
                        </textarea>
                        <div className="flex flex-col">
                            <br />
                            <h3>Attach</h3>
                            {/* {GetAttachItem.map((attachItem) => ( */}
                            <div className="flex flex-row gap-2">
                                <FaFile className="w-6 h-6" />
                                <p className="ml-1">test{}</p>
                            </div>
                            {/* ))} */}
                        </div>
                    </div>
                    <div className="flex flex-row place-content-end">
                        <Button type="primary" onClick={handleOk}>
                            Send Offering
                        </Button>
                    </div>
                </Modal>
                {}
            </Card>
        </Card>
    );
}

function DetailPostTaskBid() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onAcceptBid = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    return (
        <Card className="flex flex-col">
            <div className="flex flex-row place-content-between">
                <h2>Bid</h2>
                <p className="font-bold">Accept: 1/2</p>
            </div>
            <Card>
                <div className="flex flex-row place-content-between">
                    <DetailPostProfileContent />
                    <p>12 Nov 2022</p>
                </div>
                <div className="text-primary">
                    <br />
                    <h3>Bidding price</h3>
                    <p>Rp. 300.000</p>
                </div>
                <DetailPostTextContent>
                    {`Criteria
                    
                    test aja
                    test aja
                    `}
                </DetailPostTextContent>
                {}
                <div className="flex flex-row place-content-end gap-2">
                    <Button type="primary" onClick={onAcceptBid}>
                        Accept
                    </Button>
                    <Link to={CHAT_PATH}>
                        <Button type="primary" className="flex rounded-full">
                            <FaPaperPlane />
                        </Button>
                    </Link>
                    {/* <div className="flex flex-row text-green-500">
                    <AiOutlineCheck />
                    <p>You accept this hero</p>
                </div> */}
                </div>
                <Modal title="Payment" open={isModalOpen} footer={null}>
                    <div className="flex flex-col items-center justify-center">
                        <h1>Rp. 300.000,-</h1>
                        <p>It&rsquo;s It will be 300 Token</p>
                        <p>You have 400 token left</p>
                        {/* <Button type="primary" onClick={handleOk}>
                        Buy Token
                    </Button> */}
                    </div>
                    <div className="flex flex-row place-content-between">
                        <div className="flex flex-row ">
                            <FaInfo />
                            <p>1 token represents Rp.1000</p>
                        </div>
                        <Button type="primary" onClick={handleOk}>
                            Pay
                        </Button>
                        {/* <Button type="primary" onClick={handleOk}>
                        Pay
                    </Button> */}
                    </div>
                </Modal>
                {}
            </Card>
        </Card>
    );
}

function DetailPostContentHiring() {
    const cumaButton = ["App", "development", "Firebase", "Kotlin", "API Rest"];
    return (
        <Card className="flex flex-col">
            <h2>I can make you a beatifull vector photo of you</h2>
            <h3>PT. Dicoding</h3>
            <h3>Owner: ??</h3>
            <p>Post 23 November 2022</p>
            <DetailPostTextContent key={cumaButton}>
                {`Call Text Service Text
                    
                    test aja
                    test aja
                    test aja
                    test aja
                    test aja
                    `}
            </DetailPostTextContent>
            <div>
                <br />
                <h3>Type of Job</h3>
                <p>Hiring</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex-row gap-2">
                    <h3>Category</h3>
                    {cumaButton.map((categoryItem) => (
                        <button type="button" className="gap-2 p-2 rounded-lg bg-primary text-base border-0">
                            {categoryItem}
                        </button>
                    ))}
                </div>
                <div className="flex-1 flex-row gap-2">
                    <h3>Skills</h3>
                    {cumaButton.map((TagsItem) => (
                        <button type="button" className="gap-2 p-2 rounded-lg bg-primary text-base border-0">
                            {TagsItem}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <br />
                <h3>Progress</h3>
                <p>Proceed Hiring</p>
            </div>
        </Card>
    );
}

function DetailPostContentTask() {
    const cumaButton = ["App", "development", "Firebase", "Kotlin", "API Rest"];
    return (
        <Card className="flex flex-col">
            <h2>I can make you a beatifull vector photo of you</h2>
            <h3>Owner: ??</h3>
            <p>Post 23 November 2022</p>
            <span className="flex flex-row items-center justify-start">
                <p className="font-bold">Rp. 200.000,- </p>
                <p> Not Fixed Price</p>
            </span>
            <DetailPostTextContent key={cumaButton}>
                {`Call Text Service Text
                    
                    test aja
                    test aja
                    test aja
                    test aja
                    test aja
                    `}
            </DetailPostTextContent>
            <div>
                <br />
                <h3>Type of Job</h3>
                <p>Task</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex-row gap-2">
                    <h3>Category</h3>
                    {cumaButton.map((categoryItem) => (
                        <button type="button" className="gap-2 p-2 rounded-lg bg-primary text-base border-0">
                            {categoryItem}
                        </button>
                    ))}
                </div>
                <div className="flex-1 flex-row gap-2">
                    <h3>Skills</h3>
                    {cumaButton.map((TagsItem) => (
                        <button type="button" className="gap-2 p-2 rounded-lg bg-primary text-base border-0">
                            {TagsItem}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <br />
                <h3>Progress</h3>
                <p>Waiting Owner Accept Bid</p>
            </div>
        </Card>
    );
}

function DetailPost() {
    return (
        <Layout>
            <br />
            <div className="flex flex-col">
                <DetailPostContentTask />
            </div>
            <br />
            <div className="flex flex-col">
                <DetailPostContentHiring />
            </div>
            <br />
            <div className="flex flex-col">
                <DetailPostTaskBid />
            </div>
            <br />
            <div className="flex flex-col">
                <DetailPostHiringApplicant />
            </div>
        </Layout>
    );
}

export default DetailPost;
