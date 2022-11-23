import { Menu } from "antd";
import React, { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import authService from "services/auth";
import { AiOutlineLogout, AiOutlineUserSwitch } from "react-icons/ai";
import { MY_ASSIGNMENT_PATH, MY_JOB_PATH, MY_POST_PATH, MY_SERVICE_PATH, PROFILE_PATH } from "utils/routes";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { StateContext } from "context/state";
import { UserContext } from "context/user";

const keys = [
    {
        key: "3",
        route: [MY_SERVICE_PATH, MY_POST_PATH],
    },
    {
        key: "4",
        route: [MY_JOB_PATH, MY_ASSIGNMENT_PATH],
    },
];

const menuAsHero: ItemType[] = [
    {
        key: "3",
        label: (
            <Link to={MY_SERVICE_PATH}>
                <p className="text-primary capitalize m-0">my service</p>
            </Link>
        ),
    },
    {
        key: "4",
        label: (
            <Link to={MY_JOB_PATH}>
                <p className="text-primary capitalize m-0">my job</p>
            </Link>
        ),
    },
];

const menuAsOwner: ItemType[] = [
    {
        key: "3",
        label: (
            <Link to={MY_POST_PATH}>
                <p className="text-primary capitalize m-0">my post</p>
            </Link>
        ),
    },
    {
        key: "4",
        label: (
            <Link to={MY_ASSIGNMENT_PATH}>
                <p className="text-primary capitalize m-0">my assignment</p>
            </Link>
        ),
    },
];

function MenuNavigation() {
    const location = useLocation();

    const user = authService.CurrentUser();
    const { state, changeRole } = useContext(StateContext);
    const { state: userState } = useContext(UserContext);

    const logoutHandler = async () => {
        await authService.Logout();
        window.location.reload();
    };

    const switchRoleHandler = () => {
        if (changeRole) changeRole();
    };

    const menu = useMemo(() => {
        const profileMenu: ItemType = {
            key: "1",
            label: (
                <Link to={PROFILE_PATH}>
                    <div className="flex flex-col py-3 w-[220px]">
                        <p className="capitalize text-gray-800 text-lg m-0">{userState.user?.name}</p>
                        <p className="text-gray-400 text-xs m-0">{user?.email}</p>
                    </div>
                </Link>
            ),
        };
        const roleMenu: ItemType = {
            key: "2",
            label: (
                <div className="text-primary bg-white capitalize flex items-center m-0 w-full px-4 py-2 border border-solid border-primary rounded-md ">
                    <AiOutlineUserSwitch className="text-primary mr-2 text-xl" />
                    {`switch to ${state?.role === "hero" ? "owner" : "hero"}`}
                </div>
            ),
            onClick: switchRoleHandler,
        };
        const signoutMenu: ItemType = {
            key: "100",
            danger: true,
            label: <p className="capitalize m-0">logout</p>,
            icon: <AiOutlineLogout className="!text-lg" />,
            onClick: logoutHandler,
        };
        if (state?.role === "hero") {
            return [profileMenu, roleMenu, ...menuAsHero, signoutMenu];
        }
        return [profileMenu, roleMenu, ...menuAsOwner, signoutMenu];
    }, [state, user]);

    return <Menu selectedKeys={[keys.find((key) => key.route.find((el) => el === location.pathname))?.key || "0"]} items={menu} />;
}

export default MenuNavigation;
