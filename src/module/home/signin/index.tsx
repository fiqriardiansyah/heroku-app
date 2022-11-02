import { StateContext } from "context/state";
import React, { useContext } from "react";
import HomeAsHero from "./as-hero";
import HomeAsOwner from "./as-owner";

function HomeSignIn() {
    const { state } = useContext(StateContext);
    if (state?.role === "hero") return <HomeAsHero />;
    return <HomeAsOwner />;
}

export default HomeSignIn;
