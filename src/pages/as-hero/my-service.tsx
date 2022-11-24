/* eslint-disable no-prototype-builtins */
import { AutoComplete, Button, Card, Input, Table, Tabs } from "antd";
import Layout from "components/common/layout";
import { getDatabase } from "firebase/database";
import React, { useContext, useState } from "react";
import authService from "services/auth";
import HeroServiceSupport from "services/support/hero";
import Swal from "sweetalert2";
import NoJobs from "assets/svgs/no-jobs.svg";
import { useNavigate, Link } from "react-router-dom";
import { CREATE_SERVICE_PATH, SERVICE_HERO_PATH } from "utils/routes";
import { UserContext } from "context/user";
import { ServiceData } from "models";
import ActiveServiceTable from "module/my-service/active-service-table";
import DraftServiceTable from "module/my-service/draft-service-table";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import heroService from "services/hero";

function MyService() {
    const user = authService.CurrentUser();

    const [tab, setTab] = useState<"active" | "draft">("active");
    const [services, setServices] = useState<ServiceData[]>([]);

    const inActiveButtonStyle = { border: "none", backgroundColor: "inherit" };

    const servicesQuery = useQuery(
        ["services"],
        async () => {
            const res = await heroService.GetAllMyServicesData({ uid: user?.uid as any });
            return res;
        },
        {
            onSuccess: (srvcs) => {
                if (!srvcs || srvcs.length === 0) return;
                setServices(srvcs?.filter((service) => service.status === tab));
            },
        }
    );

    const deleteMutation = useMutation(
        async ({ id, callback }: { id: string; callback: () => void }) => {
            await heroService.DeleteMyService(id);
            callback();
        },
        {
            onSuccess: () => {
                servicesQuery.refetch();
            },
        }
    );

    const myServicesOnClick = () => {
        Swal.fire("What is My Services?", "My Services is page of your service that you provide for people who needs");
    };

    const onDraftBtnClick = () => {
        setServices(servicesQuery.data?.filter((service) => service.status === "draft") || []);
        setTab("draft");
    };

    const onActiveBtnClick = () => {
        setServices(servicesQuery.data?.filter((service) => service.status === "active") || []);
        setTab("active");
    };

    const clickServiceDraftHandler = (service: ServiceData, callback: () => void) => {
        deleteMutation.mutate({
            id: service.id as any,
            callback,
        });
    };

    const onSearchChange = (e: any) => {
        const query = e.target.value;
        setServices([...(servicesQuery.data || [])].filter((service) => service.title.includes(query) && service.status === tab));
    };

    return (
        <Layout>
            <br />
            <div className="flex flex-row space-x-2 justify-between flex-wrap">
                <div className="flex items-center">
                    <p className="m-0 mr-2 font-semibold text-xl capitalize">create service</p>
                    <AiFillQuestionCircle className="text-gray-400 text-xl cursor-pointer" onClick={myServicesOnClick} />
                </div>
                <div className="flex flex-row gap-1">
                    <Input placeholder="Search service" onChange={onSearchChange} />
                    <br />
                    <Link to={CREATE_SERVICE_PATH}>
                        <Button type="primary">Create New Service</Button>
                    </Link>
                </div>
            </div>
            <br />
            <div className="flex gap-2 mb-3">
                {tab === "active" ? (
                    <Button type="primary">Active</Button>
                ) : (
                    <Button onClick={onActiveBtnClick} style={inActiveButtonStyle}>
                        Active
                    </Button>
                )}
                {tab === "draft" ? (
                    <Button type="primary">Draft</Button>
                ) : (
                    <Button onClick={onDraftBtnClick} style={inActiveButtonStyle}>
                        Draft
                    </Button>
                )}
            </div>

            {tab === "active" ? (
                <ActiveServiceTable fetcher={servicesQuery} services={services} />
            ) : (
                <DraftServiceTable onClickDelete={clickServiceDraftHandler} fetcher={servicesQuery} services={services} />
            )}
        </Layout>
    );
}

export default MyService;
