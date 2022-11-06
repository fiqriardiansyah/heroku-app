import { Button, Input, Space } from "antd";
import { StateContext } from "context/state";
import { getDatabase } from "firebase/database";
import { Poster, Service } from "models";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import authService from "services/auth";
import heroService from "services/hero";
import RealtimeDatabase from "services/utils/realtime-database";
import { SERVICE_HERO_PATH } from "utils/routes";
import NoJobs from "assets/svgs/no-jobs.svg";
import PosterItem from "components/PosterItem";

function HomeAsHero() {
    const user = authService.CurrentUser();
    const [posters, setPosters] = useState<Poster[]>([]);
    const [filter, setfilter] = useState("");
    const db = new RealtimeDatabase(getDatabase());
    useEffect(() => {
        const getPosters = async () => {
            const allPosters = await db.GetAllPoster();
            setPosters(allPosters);
        };
        getPosters();
    }, []);
    if (posters.length === 0) {
        return (
            <div className="w-full h-full">
                <div
                    className="w-full py-2.5 px-5 bg-white rounded-xl mt-7 border border-solid"
                    style={{ borderColor: "#B4B4B4" }}
                >
                    <h2
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                        className="text-2.5xl font-semibold"
                    >
                        Explore Jobs
                    </h2>
                    <div className="flex gap-x-2.5">
                        <Input
                            style={{ borderRadius: "4px" }}
                            placeholder="Search keyword title like “Build landing page using React “"
                            value={filter}
                            onInput={(e) => {
                                setfilter(e.currentTarget.value);
                            }}
                        />
                        <Button
                            style={{
                                borderRadius: "5px",
                            }}
                            size="large"
                            type="primary"
                        >
                            Search
                        </Button>
                    </div>
                </div>
                <div
                    style={{ border: "1px solid #CECECE" }}
                    className="w-full mt-5 py-3 px-5 bg-white rounded-xl h-80vh flex justify-center align-middle"
                >
                    <img src={NoJobs} alt="No Jobs" className="w-96 " />
                </div>
            </div>
        );
    }

    const filteredPosters = posters.filter((poster) => poster.title === filter);
    return (
        // Search
        <div className="w-full h-full">
            <div
                className="w-full py-2.5 px-5 bg-white rounded-xl mt-7 border border-solid"
                style={{ borderColor: "#B4B4B4" }}
            >
                <h2
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    className="text-2.5xl font-semibold"
                >
                    Explore Jobs
                </h2>
                <div className="flex gap-x-2.5">
                    <Input
                        style={{ borderRadius: "4px" }}
                        placeholder="Search keyword title like “Build landing page using React “"
                        value={filter}
                        onInput={(e) => setfilter(e.currentTarget.value)}
                    />
                    <Button
                        style={{
                            borderRadius: "5px",
                        }}
                        size="large"
                        type="primary"
                    >
                        Search
                    </Button>
                </div>
            </div>

            {/* List item */}
            <div
                style={{ border: "1px solid #CECECE" }}
                className="mt-5 py-3 px-5 bg-white rounded-xl h-full"
            >
                {filteredPosters.map((poster) => {
                    return <PosterItem poster={poster} />;
                })}
            </div>
        </div>
    );
}

export default HomeAsHero;
