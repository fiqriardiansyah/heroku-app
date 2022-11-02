import { StateContext } from "context/state";
import { Poster } from "models";
import moment from "moment";
import React, { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import authService from "services/auth";
import ownerService from "services/owner";

function HomeAsOwner() {
    const user = authService.CurrentUser();
    const { state } = useContext(StateContext);

    return <div className="wfull">as owner</div>;
}

export default HomeAsOwner;
