import { StateContext } from "context/state";
import useRealtimeValue from "hooks/useRealtimeValue";
import { Service } from "models";
import React, { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import authService from "services/auth";
import heroService from "services/hero";
import ownerService from "services/owner";
import { SERVICE_HERO_PATH } from "utils/routes";

function HomeAsHero() {
    const user = authService.CurrentUser();

    // const { data } = useRealtimeValue(({ setData, setLoading }) => {
    //     heroService._getAllShowServicesData((servicesData) => {
    //         setLoading(false);
    //         setData(servicesData);
    //     });
    // });

    // const services = useQuery("", async () => {
    //     const svs = await heroService.GetServices({ uid: user?.uid as any });
    //     return svs;
    // });

    // const servicesData = useQuery("", async () => {
    //     const svs = await heroService.GetServicesData({ uid: user?.uid as any });
    //     return svs;
    // });

    // const myPosters = useQuery("", async () => {
    //     const svs = await ownerService.GetMyPoster({ uid: user?.uid as any });
    //     return svs;
    // });

    // const getPoster = useQuery("", async () => {
    //     const svs = await ownerService.GetOnePoster({ pid: "83a194da-e30c-45f7-8157-02462044c35c" });
    //     return svs;
    // });

    const createPoster = useMutation(async () => {
        const req = await ownerService.CreatePoster({
            uid: user?.uid as any,
            data: {
                title: "new poster",
                description: "my new poster bitch!",
                category: "web development",
                skills: ["javascript", "kotlin"],
                type_of_job: "hiring",
                company: "pt. presentologic",
            },
        });
        return req;
    });

    const create = useMutation(async () => {
        const req = await heroService.CreateService({
            uid: user?.uid as any,
            status: "active",
            service: {
                category: "web development",
                title: "test web dev",
                description: "asdf asdfa sdfasdf asdf asdfasdf asdf asdf",
                images: ["images.png"],
                price: 1200000,
                subcategory: "front end",
                tags: ["javascript", "kotlin"],
                pdfs: [],
            },
        });
        return req;
    });

    return (
        <div className="wfull">
            <button type="button" onClick={() => create.mutate()}>
                create servcie
            </button>
            <button type="button" onClick={() => createPoster.mutate()}>
                create poster
            </button>
        </div>
    );
}

export default HomeAsHero;
