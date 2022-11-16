import { Button, Card, Collapse, Steps } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { DETAIL_JOB_PATH } from "utils/routes";
import { JobsData } from "./Models";

interface MyJobHeaderData {
    owner: string | undefined;
    created: any | undefined;
    company?: any;
}

function MyJobHeader({ owner, created, company }: MyJobHeaderData) {
    return (
        <div>
            {company && <p className="mb-0 font-medium">{company}</p>}
            <p className="mb-0">{`Owner: ${owner}`}</p>
            <p className="text-12 text-gray-400">{`Post: ${created}`}</p>
        </div>
    );
}

function MyJobCard({
    status,
    current = 0,
    job,
    description,
    onFinishStep,
}: {
    status: "ongoing" | "inbid" | "finish";
    current: number | undefined;
    job: JobsData;
    description?: string;
    onFinishStep?: any;
}) {
    const { Panel } = Collapse;

    if (status === "inbid") {
        return (
            <Card className="flex flex-col">
                <div className="flex justify-between text-16 font-medium">
                    <Link className="text-black hover:text-blue-900" to={`${DETAIL_JOB_PATH}/${job.id}`}>
                        <p className="m-0">{job.title}</p>
                    </Link>
                    <p className="m-0">Rp. {job.price}</p>
                </div>
                <Collapse ghost>
                    <Panel header={<MyJobHeader owner={job?.owner} created={job.date} />} key={1}>
                        <div className="border border-gray-100 border-solid rounded-xl bg-gray-200 p-3">
                            <div className="flex justify-between mb-5">
                                <p className="text-16 font-medium">Bid Letter</p>
                                <p className="text-12 text-gray-500">Post 12 Oct 2022</p>
                            </div>
                            <p className="text-gray-500 mb-10 text-16">${description}</p>
                        </div>
                    </Panel>
                </Collapse>
            </Card>
        );
    }

    if (status === "finish") {
        return (
            <Card className="flex flex-col">
                <div className="flex justify-between text-16 font-medium">
                    <Link className="text-black hover:text-blue-900" to={`${DETAIL_JOB_PATH}/${job.id}`}>
                        <p className="m-0">{job.title}</p>
                    </Link>
                    <p className="m-0">Rp. {job.price}</p>
                </div>
                <Collapse ghost>
                    <Panel header={<MyJobHeader company={job.company} owner={job?.owner} created={job.date} />} key={1}>
                        <div className="w-full flex justify-center my-4 p-3 flex-col items-center">
                            <p className="text-5xl font-medium mb-2">Congrats!</p>
                            {job.type_of_job ? (
                                <p className="text-3xl m-0 text-gray-400">You Got This Job!</p>
                            ) : (
                                <p className="text-3xl m-0 text-gray-400">You Have Finished This!</p>
                            )}
                        </div>
                    </Panel>
                </Collapse>
            </Card>
        );
    }

    const { Step } = Steps;
    return (
        <Card className="mt-4">
            <div className="flex justify-between text-16 font-medium">
                <Link className="text-black hover:text-blue-900" to={`${DETAIL_JOB_PATH}/${job.id}`}>
                    <p className="m-0">{job.title}</p>
                </Link>
                <p className="m-0">Rp. {job.price}</p>
            </div>
            <Collapse ghost>
                <Panel style={{ padding: "0px" }} header={<MyJobHeader owner={job?.owner} created={job.date} />} key={1}>
                    <div className="my-12 px-5 ">
                        <Steps current={current}>
                            <Step title="Start" description="Starting on project 10 Oct 2022" />
                            <Step title="In Progress" description="in the process of service" />
                            <Step title="Deliver" description="Send work" />
                            <Step title="Checking" description="Check work results" />
                        </Steps>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => onFinishStep(job.id, job.current)} type="primary">
                            Finish
                        </Button>
                    </div>
                </Panel>
            </Collapse>
        </Card>
    );
}

export default MyJobCard;
