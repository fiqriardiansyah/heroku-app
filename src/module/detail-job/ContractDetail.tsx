import { Button, Card, Steps } from "antd";
import { Bid, Poster } from "models";
import React, { useState } from "react";

/** Mock get offering letter */
const getOfferingLetter = () => {
    return `Yang terhormat Fiqri ardiansyah,

    Selamat!
    Kami dengan senang hati menawarkan kepada Anda posisi [penuh waktu, paruh waktu, dll.] dari [jabatan] di [nama perusahaan] dengan tanggal mulai [tanggal mulai], bergantung pada [pemeriksaan latar belakang, formulir I-9 , dll.]. Anda akan melapor langsung ke [nama manajer/penyelia] di [lokasi tempat kerja]. Kami percaya keterampilan dan pengalaman Anda sangat cocok untuk perusahaan kami.`;
};

function ContractDetail({ job, bidLetter }: { job: Poster; bidLetter: Bid }) {
    const [currentStep, setCurrentStep] = useState(bidLetter.status);

    const onFinishStep = () => {
        // if (currentStep >= 4) return;
        // setCurrentStep(currentStep + 1);
    };

    const { Step } = Steps;
    if (job.type_of_job === "hiring") {
        return (
            <>
                <br />
                <div className="flex gap-5">
                    <div className="w-8/12">
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
                        <br />
                        <Card>
                            <p className="text-16 font-medium mb-2">Application Letter</p>
                            {/* <p className="text-gray-400">{bidLetter.description}</p> */}
                        </Card>
                        <br />
                        <Card>
                            <p className="text-16 font-medium mb-2">Offering Letter</p>
                            <p className="text-gray-400">{getOfferingLetter()}</p>
                        </Card>
                    </div>
                    <Card className="h-fit w-4/12">
                        <Steps direction="vertical" current={currentStep}>
                            <Step title="Start" description="Starting on project 10 Oct 2022" />
                            <Step title="In Progress" description="in the process of service" />
                            <Step title="Deliver" description="Send work" />
                            <Step title="Checking" description="Check work results" />
                        </Steps>
                        <div className="flex justify-end">
                            <Button onClick={onFinishStep} className="mt-2" type="primary">
                                Finish
                            </Button>
                        </div>
                    </Card>
                </div>
            </>
        );
    }
    return (
        <>
            <br />
            <div className="flex gap-5">
                <div className="w-8/12">
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
                    <br />
                    <Card>
                        <p className="text-16 font-medium mb-2">Bid Letter</p>
                        {/* <p className="text-gray-400">{bidLetter.description}</p> */}
                    </Card>
                </div>
                <Card className="h-fit w-4/12">
                    <Steps direction="vertical" current={currentStep}>
                        <Step title="Start" description="Starting on project 10 Oct 2022" />
                        <Step title="In Progress" description="in the process of service" />
                        <Step title="Deliver" description="Send work" />
                        <Step title="Checking" description="Check work results" />
                    </Steps>
                    <div className="flex justify-end">
                        <Button onClick={onFinishStep} className="mt-2" type="primary">
                            Finish
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}

export default ContractDetail;
