import { StateContext } from "context/state";
import useRealtimeValue from "hooks/useRealtimeValue";
import { Poster } from "models";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import authService from "services/auth";
import ownerService from "services/owner";

function HomeAsOwner() {
    const user = authService.CurrentUser();
    const { state } = useContext(StateContext);
    const [query, setQuery] = useState("");

    // const { data, loading } = useRealtimeValue(({ setData, setLoading }) => {
    //     ownerService._getAllPoster((posters) => {
    //         setLoading(false);
    //         setData(posters);
    //     });
    // });

    // const { data, loading } = useRealtimeValue(({ setData, setLoading }) => {
    //     ownerService._searchPoster(query, (posters) => {
    //         setLoading(false);
    //         setData(posters);
    //     });
    // }, query);

    return (
        <div className="wfull">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
    );
}

export default HomeAsOwner;
