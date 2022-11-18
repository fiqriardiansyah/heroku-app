import { Card } from "antd";
import React from "react";
import { MyJobData } from "./Models";
import MyJobCard from "./MyJobCard";

function MyContractList({ jobs, fetcher }: { jobs: MyJobData[]; fetcher: any }) {
    return (
        <div className="flex flex-col gap-6">
            {jobs.map((job) => (
                <MyJobCard key={job.id} job={job} status={job.status} current={job?.current} />
            ))}
        </div>
    );
}

export default MyContractList;
