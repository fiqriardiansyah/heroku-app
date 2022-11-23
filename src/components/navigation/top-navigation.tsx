import React, { useContext } from "react";
import { FaPaperPlane } from "react-icons/fa";

import HeroKuImage from "assets/svgs/heroku.svg";
import { Button, Dropdown, Space } from "antd";
import useAuthChange from "hooks/useAuthChange";
import { Link } from "react-router-dom";
import ProfileImage from "assets/images/profile.webp";
import { CHAT_PATH, HOME_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from "utils/routes";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import MenuNavigation from "./menu-navigation";

function TopNavigation() {
    const { user } = useAuthChange();
    const { state } = useContext(StateContext);
    const { state: userState } = useContext(UserContext);

    return (
        <div className=" bg-white sticky top-0 left-0 z-200">
            <div className="CONTAINER flex items-center justify-between h-16">
                <div className="flex items-center">
                    <Link to={HOME_PATH}>
                        <img src={HeroKuImage} alt="heroku" />
                    </Link>
                    {user && <p className="text-gray-400 capitalize m-0 ml-3">{`as ${state?.role}`}</p>}
                </div>
                <div className="flex items-center">
                    {!user ? (
                        <Space direction="horizontal">
                            <Link to={SIGN_IN_PATH}>
                                <Button type="text" className="BUTTON-BASE">
                                    log in
                                </Button>
                            </Link>
                            <Link to={SIGN_UP_PATH}>
                                <Button type="primary" className="BUTTON-PRIMARY-ROUND">
                                    sign up
                                </Button>
                            </Link>
                        </Space>
                    ) : (
                        <Space direction="horizontal" size={30}>
                            <Link to={CHAT_PATH}>
                                <Button
                                    size="large"
                                    shape="circle"
                                    className="!flex !items-center !justify-center !border-none !text-primary"
                                    icon={<FaPaperPlane />}
                                />
                            </Link>
                            <Dropdown overlay={<MenuNavigation />}>
                                <Button size="large" shape="circle" className="!border-none !p-0 !overflow-hidden">
                                    <img
                                        referrerPolicy="no-referrer"
                                        src={userState.user?.profile || user?.photoURL || ProfileImage}
                                        alt=""
                                        className="w-full h-full object-cover rounded-full bg-gray-500"
                                    />
                                </Button>
                            </Dropdown>
                        </Space>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopNavigation;
