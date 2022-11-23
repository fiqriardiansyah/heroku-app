import { Alert, Card, Skeleton } from "antd";
import State from "components/common/state";
import React from "react";
import { useQuery } from "react-query";
import NoJobs from "assets/svgs/no-jobs.svg";
import authService from "services/auth";
import heroService from "services/hero";
import MyContractCard from "./MyContractCard";

function MyContractList() {
    const user = authService.CurrentUser();

    const myApplicationQuery = useQuery(["my-application"], async () => {
        const apps = heroService.GetAllMyApplication({ uid: user?.uid as any });
        return apps;
    });

    return (
        <div className="flex flex-col gap-6">
            <State data={myApplicationQuery.data} isLoading={myApplicationQuery.isLoading} isError={myApplicationQuery.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            {myApplicationQuery.data?.length === 0 ? (
                                <Card className="w-full py-3 px-5 bg-white rounded-xl h-80vh flex justify-center align-middle">
                                    <img src={NoJobs} alt="No Jobs" className="w-11/12 h-full sm:w-96" />
                                </Card>
                            ) : (
                                myApplicationQuery.data?.map((app) => <MyContractCard application={app} key={app.id} />)
                            )}
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 4 }} avatar active />
                            <Skeleton paragraph={{ rows: 4 }} avatar active className="mt-4" />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(myApplicationQuery.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
        </div>
    );
}

export default MyContractList;
