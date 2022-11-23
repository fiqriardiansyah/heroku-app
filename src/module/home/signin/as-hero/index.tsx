/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unreachable */
import { Button, Card, Input, Space } from "antd";
import useRealtimeValue from "hooks/useRealtimeValue";
import { Poster, Service } from "models";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import heroService from "services/hero";
import EmptyImage from "assets/svgs/no-jobs.svg";
import JobCard from "./job-card";

function HomeAsHero() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query");

    const { data, loading } = useRealtimeValue<Poster[]>(({ setData, setLoading }) => {
        heroService._getAllShowPoster((posters) => {
            setLoading(false);
            setData(posters);
        });
    });

    const searchMutation = useQuery(
        [query],
        async () => {
            return heroService.ProxyRequest(async () => {
                const posters = heroService.SearchPoster(query || "");
                return posters;
            });
        },
        {
            enabled: !!query,
        }
    );

    const onSearch = (key: string) => {
        setSearchParams({
            query: key,
        });
    };

    return (
        <div className="grid">
            <br />
            <Card title="Explore Jobs">
                <Input.Search
                    onSearch={onSearch}
                    placeholder="Search keyword"
                    enterButton="Search"
                    size="middle"
                    loading={searchMutation.isLoading}
                />
            </Card>
            <br />
            <Card className="CONTAINER">
                <div className="flex flex-col">
                    {(loading || searchMutation.isLoading) && [...new Array(2)].map((_, i) => <JobCard.Loading key={i} />)}
                    {!loading && !query && data?.map((poster) => <JobCard poster={poster} key={poster.id} />)}
                    {!searchMutation.isLoading && query && searchMutation.data?.map((poster) => <JobCard poster={poster} key={poster.id} />)}
                </div>
                {(!data || data.length === 0 || searchMutation.data?.length === 0) && (
                    <div className="w-full flex items-center justify-center flex-col">
                        <img src={EmptyImage} alt="no job" className="w-11/12 h-full sm:w-96" />
                    </div>
                )}
            </Card>
        </div>
    );
}

export default HomeAsHero;
