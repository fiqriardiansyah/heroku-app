import { Card } from "antd";
import { Poster } from "models";
import React from "react";
import { UseQueryResult } from "react-query";
import Utils from "utils";
import ApplicationCard from "./application-card";

type Props<T> = {
    fetcher: UseQueryResult<T, unknown>;
};

function Applicants<T extends Poster>({ fetcher }: Props<T>) {
    const apps = fetcher.data?.applications ? Utils.parseTreeObjectToArray<{ apcid: string; id: string }>(fetcher.data.applications) : [];
    return (
        <Card>
            <div className="flex w-full items-center justify-between mb-5">
                <p className="capitalize font-semibold m-0">Applicant</p>
                <p className="capitalize m-0">Applicant: {`${fetcher.data?.accepted_hero || 0}/${fetcher.data?.limit_applicant}`}</p>
            </div>
            {apps?.map((app) => (
                <ApplicationCard fetcher={fetcher} key={app.id} apcid={app.apcid} />
            ))}
        </Card>
    );
}

export default Applicants;
