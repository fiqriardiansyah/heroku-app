/* eslint-disable no-prototype-builtins */
import { AutoComplete, Button, Card, Input, Table, Tabs } from "antd";
import Layout from "components/common/layout";
import { UserContext } from "context/user";
import { ServiceData } from "models";
import ActiveServiceTable from "module/my-service/active-service-table";
import DraftServiceTable from "module/my-service/draft-service-table";
import React, { useContext, useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import authService from "services/auth";
import heroService from "services/hero";
import Swal from "sweetalert2";
import { CREATE_SERVICE_PATH } from "utils/routes";

const mockVal = (data: string[], query: string) => {
    const filteredTitle = data.filter((val) => val.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    const result = filteredTitle.map((value) => ({ value }));
    return result;
};

function MyService() {
    const user = authService.CurrentUser();
    const [tab, setTab] = useState<ServiceData["status"]>("active");
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
        Swal.fire("Apa itu My Services?", "That thing is still around?", "question");
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
            <div className="flex flex-row space-x-2 justify-between">
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
