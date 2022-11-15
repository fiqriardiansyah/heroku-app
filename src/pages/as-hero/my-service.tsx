/* eslint-disable no-prototype-builtins */
import { AutoComplete, Button, Card, Input, Table, Tabs } from "antd";
import Layout from "components/common/layout";
import { getDatabase } from "firebase/database";
import React, { useContext, useState } from "react";
import authService from "services/auth";
import HeroServiceSupport from "services/support/hero";
import Swal from "sweetalert2";
import NoJobs from "assets/svgs/no-jobs.svg";
import { useNavigate } from "react-router-dom";
import { CREATE_SERVICE_PATH, SERVICE_HERO_PATH } from "utils/routes";
import { UserContext } from "context/user";
import { ServiceData } from "models";
import ActiveServiceTable from "module/my-service/active-service-table";
import DraftServiceTable from "module/my-service/draft-service-table";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import heroService from "services/hero";

interface ServiceActiveDataSource {
    id: any;
    key: any;
    no: number;
    title: string;
    finish: string;
    order: any;
    request: any;
    view: number;
}

interface ServiceDraftDataSource {
    id: any;
    key: any;
    no: number;
    created: string;
    title: string;
}

interface ServiceListProps {
    activeData?: ServiceActiveDataSource[];
    draftData?: ServiceDraftDataSource[];
    tab: "active" | "draft";
    onDraftDelete: any;
    onActiveServiceClick: any;
    onDraftServiceClick: any;
}

const mockVal = (data: string[], query: string) => {
    const filteredTitle = data.filter((val) => val.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    const result = filteredTitle.map((value) => ({ value }));
    return result;
};

function ServicesList({ activeData = [], draftData = [], tab, onDraftDelete, onActiveServiceClick, onDraftServiceClick }: ServiceListProps) {
    if (tab === "active") {
        if (activeData.length > 0) {
            return (
                <Card>
                    <table className="w-full">
                        <thead style={{ color: "#6A6A6A", borderBottom: "1px solid #D7D7D7", fontSize: "16px" }} className="w-full ">
                            <tr className="w-full flex gap-4">
                                <th className="p-1 basis-9">No</th>
                                <th className="grow p-1 text-left">Service</th>
                                <th className="p-1 basis-1/12 text-left">Finish</th>
                                <th className="p-1 basis-1/12 text-left">Order</th>
                                <th className="p-1 basis-1/12 text-left">View</th>
                                <th className="p-1 basis-1/12 text-left">Request</th>
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {activeData.map((data) => (
                                <tr
                                    onClick={() => onActiveServiceClick(data.id)}
                                    key={data.id}
                                    className="w-full flex gap-4 py-2 hover:bg-gray-50 hover:cursor-pointer"
                                >
                                    <td className="p-1 basis-9">{data.no}</td>
                                    <td className="grow p-1 text-left">{data.title}</td>
                                    <td className="p-1 basis-1/12">{data.finish}</td>
                                    <td className="p-1 basis-1/12">{data.order}</td>
                                    <td className="p-1 basis-1/12">{data.view}</td>
                                    <td className="p-1 basis-1/12">{data.request}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            );
        }
        return (
            <div
                style={{ border: "1px solid #CECECE" }}
                className="w-full mt-5 py-3 px-5 bg-white rounded-xl h-80vh flex justify-center align-middle"
            >
                <img src={NoJobs} alt="No Jobs" className="w-96 " />
            </div>
        );
    }

    if (draftData.length > 0) {
        return (
            <Card>
                <table className="w-full">
                    <thead style={{ color: "#6A6A6A", borderBottom: "1px solid #D7D7D7", fontSize: "16px" }} className="w-full ">
                        <tr className="w-full flex gap-4">
                            <th className="p-1 basis-9">No</th>
                            <th className="grow p-1 text-left">Service</th>
                            <th className="p-1 basis-3/12 text-left">Created at</th>
                            <th className="p-1 basis-3/12 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody className="w-full">
                        {draftData.map((data) => (
                            <tr onClick={onDraftServiceClick} key={data.id} className="w-full flex gap-4 py-2 hover:bg-gray-50 hover:cursor-pointer">
                                <td className="p-1 basis-9">{data.no}</td>
                                <td className="grow p-1 text-left">{data.title}</td>
                                <td className="p-1 basis-3/12 text-left">{data.created}</td>
                                <td className="p-1 basis-3/12 text-left">
                                    <Button onClick={() => onDraftDelete(data.id)} type="primary" danger>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        );
    }

    return (
        <div style={{ border: "1px solid #CECECE" }} className="w-full mt-5 py-3 px-5 bg-white rounded-xl h-80vh flex justify-center align-middle">
            <img src={NoJobs} alt="No Jobs" className="w-96 " />
        </div>
    );
}

function MyService() {
    const db = new HeroServiceSupport(getDatabase());
    const user = authService.CurrentUser();
    const navigate = useNavigate();

    const [value, setValue] = useState("");
    const [tab, setTab] = useState<"active" | "draft">("active");
    const [services, setServices] = useState<ServiceData[]>([]);
    const [options, setOptions] = useState<{ value: string }[]>([]);
    const [draftDataSource, setDraftDataSource] = useState<ServiceDraftDataSource[]>([]);

    const inActiveButtonStyle = { border: "none", backgroundColor: "inherit" };

    const onDraftDelete = (id: any) => {
        const newDraft = draftDataSource.filter((data) => data.id !== id);
        setDraftDataSource(newDraft);
    };

    const onActiveServiceClick = (id: any) => {
        navigate(`${SERVICE_HERO_PATH}/${user?.uid}/${id}`);
    };

    const onDraftServiceClick = () => {
        navigate(`${CREATE_SERVICE_PATH}`);
    };

    const onCreateServiceBtnClick = () => {
        navigate(`${CREATE_SERVICE_PATH}`);
    };

    React.useEffect(() => {
        async function getServices() {
            // const testService = await db.GetAllMyServices({ user?.uid });
            // console.log(testService);
            setDraftDataSource([
                {
                    id: 3,
                    created: "12 February 2022",
                    key: "1",
                    no: 1,
                    title: "Saya menggambar",
                },
            ]);
        }
        getServices();
    }, []);

    const onSelect = (data: string) => {
        console.log("onSelect", data);
    };

    const onChange = (data: string) => {
        setValue(data);
    };

    const servicesQuery = useQuery(
        ["services"],
        async () => {
            const res = heroService.GetAllMyServicesData({ uid: user?.uid as any });
            return res;
        },
        {
            onSuccess: (srvcs) => {
                if (!srvcs || srvcs.length === 0) return;
                setServices(srvcs?.filter((service) => service.status === tab));
            },
        }
    );

    const myServicesOnClick = () => {
        Swal.fire("Apa itu My Services?", "That thing is still around?", "question");
    };

    const activeDataSource: ServiceActiveDataSource[] = [
        {
            id: 1,
            key: "1",
            no: 1,
            title: "Saya bisa membuat animasi 3d menggunakan blender, adobe family dan lainnya",
            finish: "1",
            order: 1,
            request: 1,
            view: 1,
        },
        {
            id: 2,
            key: "2",
            no: 2,
            title: "Saya bisa mengedit fotomu disamping pohon",
            finish: "2",
            order: 2,
            request: 2,
            view: 2,
        },
    ];

    const onSearch = (searchText: string) => {
        if (!searchText) {
            setOptions([]);
            return;
        }

        setOptions(
            tab === "active"
                ? mockVal(
                      activeDataSource.map((data) => data.title),
                      searchText
                  )
                : mockVal(
                      draftDataSource.map((data) => data.title),
                      searchText
                  )
        );
    };

    const onDraftBtnClick = () => {
        setServices(servicesQuery.data?.filter((service) => service.status === "draft") || []);
        setTab("draft");
    };

    const onActiveBtnClick = () => {
        setServices(servicesQuery.data?.filter((service) => service.status === "active") || []);
        setTab("active");
    };

    const clickServiceDraftHandler = (service: ServiceData) => {
        console.log(service);
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

            <ServicesList
                tab={tab}
                activeData={activeDataSource}
                draftData={draftDataSource}
                onDraftDelete={onDraftDelete}
                onActiveServiceClick={onActiveServiceClick}
                onDraftServiceClick={onDraftServiceClick}
            />
            {tab === "active" ? (
                <ActiveServiceTable fetcher={servicesQuery} services={services} />
            ) : (
                <DraftServiceTable onClickDelete={clickServiceDraftHandler} fetcher={servicesQuery} services={services} />
            )}
        </Layout>
    );
}

export default MyService;
