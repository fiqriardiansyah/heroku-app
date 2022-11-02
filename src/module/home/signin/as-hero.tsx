import { StateContext } from "context/state";
import { Service } from "models";
import React, { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import authService from "services/auth";
import heroService from "services/hero";
import { SERVICE_HERO_PATH } from "utils/routes";

function HomeAsHero() {
    const user = authService.CurrentUser();
    return <div className="wfull">as hero</div>;
}

export default HomeAsHero;
