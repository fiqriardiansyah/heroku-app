import React from "react";
import { JobsData } from "./Models";
import MyJobCard from "./MyJobCard";

function MyJobList({ jobs, fetcher, onFinishStep }: { jobs: JobsData[]; fetcher: any; onFinishStep: any }) {
    return (
        <div className="flex flex-col gap-6">
            {jobs.map((job) => (
                <MyJobCard
                    onFinishStep={onFinishStep}
                    key={job.id}
                    job={job}
                    status={job.status}
                    current={job?.current}
                    description={job.description}
                />
            ))}
        </div>
    );
}

export default MyJobList;
