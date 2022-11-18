import Layout from "components/common/layout";
import Swal from "sweetalert2";
import { Alert, AutoComplete, Button, Card, Skeleton, Tabs } from "antd";
import React, { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import State from "components/common/state";
import { useQuery } from "react-query";
import ownerService from "services/owner";
import authService from "services/auth";
import TaskPost from "module/my-poster/task-post";
import HiringPost from "module/my-poster/hiring-post";
import { Poster } from "models";
import { Link } from "react-router-dom";
import { CREATE_POST_PATH } from "utils/routes";

function MyPost() {
    const user = authService.CurrentUser();
    const [tab, setTabs] = useState<"task-tabs" | "hiring-tabs">("task-tabs");
    const [post, setPost] = useState<Poster[]>([]);

    const myPosterQuery = useQuery(
        ["poster"],
        async () => {
            const posters = await ownerService.GetAllMyPoster({ uid: user?.uid as any });
            return posters;
        },
        {
            onSuccess: (posters) => {
                if (tab === "task-tabs") {
                    setPost(posters.filter((poster) => poster.type_of_job === "task"));
                    return;
                }
                setPost(posters.filter((poster) => poster.type_of_job === "hiring"));
            },
        }
    );

    const myServicesOnClick = () => {
        Swal.fire("What is My Post?", "---", "question");
    };

    const itemsTabs = [
        { label: "Task", key: "task-tabs", children: <TaskPost fetcher={myPosterQuery} posters={post} /> }, // remember to pass the key prop
        { label: "Hiring", key: "hiring-tabs", children: <HiringPost fetcher={myPosterQuery} posters={post} /> },
    ];

    const handleTabChange = (key: string) => {
        setTabs(key as any);
        if (key === "task-tabs") {
            setPost(myPosterQuery.data?.filter((poster) => poster.type_of_job === "task") || []);
            return;
        }
        setPost(myPosterQuery.data?.filter((poster) => poster.type_of_job === "hiring") || []);
    };

    return (
        <Layout>
            <br />
            <div className="flex flex-row space-x-2 justify-between">
                <div className="flex items-center">
                    <p className="m-0 mr-2 font-semibold text-xl capitalize">My Post</p>
                    <AiFillQuestionCircle className="text-gray-400 text-xl cursor-pointer" onClick={myServicesOnClick} />
                </div>
                <Link to={CREATE_POST_PATH}>
                    <Button type="primary">Create New Post</Button>
                </Link>
            </div>
            <br />
            <Card>
                <State data={myPosterQuery.data} isLoading={myPosterQuery.isLoading} isError={myPosterQuery.isError}>
                    {(state) => (
                        <>
                            <State.Data state={state}>
                                <Tabs onChange={handleTabChange} activeKey={tab} items={itemsTabs} />
                            </State.Data>
                            <State.Loading state={state}>
                                <Skeleton paragraph={{ rows: 4 }} avatar active />
                                <Skeleton paragraph={{ rows: 4 }} avatar active className="mt-4" />
                            </State.Loading>
                            <State.Error state={state}>
                                <Alert message={(myPosterQuery.error as any)?.message} type="error" />
                            </State.Error>
                        </>
                    )}
                </State>
            </Card>
        </Layout>
    );
}

export default MyPost;
