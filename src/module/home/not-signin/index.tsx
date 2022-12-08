import React from "react";
import { Button, Space } from "antd";
import { BsArrowRight } from "react-icons/bs";

import HerokuImage from "assets/svgs/heroku-image.svg";
import Bg1 from "assets/images/bg-1.png";
import Bg2 from "assets/images/bg-2.png";
import { Link } from "react-router-dom";
import { CREATE_POST_PATH, CREATE_SERVICE_PATH, SIGN_IN_PATH } from "utils/routes";
import { HERO, OWNER } from "utils/constant";

function HomeNotSignIn() {
    return (
        <div className="w-full">
            <section className="min-h-[80vh] flex items-center flex-col xl:flex-row">
                <div className="flex-1 mt-10 md:mt-0">
                    <img src={HerokuImage} alt="heroku" className="w-full" />
                </div>
                <div className="flex-1 ml-0 xl:ml-10">
                    <h1 className="capitalize text-primary font-semibold text-xl md:text-2xl xl:text-4xl">find a hero who can get your work done</h1>
                    <p className="">
                        temukan talenta dan jasa terbaik untuk <span className="font-bold">#BeresinSemua</span> urusan. Atau jadi hero dan dapatkan
                        penghasilan
                    </p>
                    <Space className="!mt-3">
                        <Link to={`${SIGN_IN_PATH}?redirect=${CREATE_SERVICE_PATH}&as=${HERO}`}>
                            <button className="capitalize bg-primary border-none px-4 py-2 rounded-full text-white cursor-pointer" type="button">
                                create service
                            </button>
                        </Link>
                        <Link to={`${SIGN_IN_PATH}?redirect=${CREATE_POST_PATH}&as=${OWNER}`}>
                            <Button type="text" className="!text-primary">
                                Need Help
                            </Button>
                        </Link>
                    </Space>
                </div>
            </section>
            <section className="relative mt-10">
                <img src={Bg1} alt="create your poster service" className="w-full object-cover h-[400px] md:h-auto" />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-8">
                    <h2 className="text-white font-semibold text-base md:text-2xl xl:text-5xl max-w-[50%]">Create your poster service</h2>
                    <p className="text-white text-xs md:text-lg xl:text-3xl max-w-[50%]">Jual jasa keahlianmu dan tunjukkan pada dunia!</p>
                    <Space>
                        <Link to={`${SIGN_IN_PATH}?redirect=${CREATE_SERVICE_PATH}&as=${HERO}`}>
                            <button
                                className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                                type="button"
                            >
                                create service
                                <BsArrowRight className="ml-2" />
                            </button>
                        </Link>
                        <Link to={`${SIGN_IN_PATH}?as=${HERO}`}>
                            <button
                                className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                                type="button"
                            >
                                find work
                                <BsArrowRight className="ml-2" />
                            </button>
                        </Link>
                    </Space>
                </div>
            </section>
            <section className="relative mt-20">
                <img src={Bg2} alt="create your poster service" className="w-full object-cover h-[400px] md:h-auto" />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-8 items-end">
                    <h2 className="text-white font-semibold text-base md:text-2xl xl:text-5xl max-w-[50%]">Find the right talent</h2>
                    <p className="text-white text-xs md:text-lg xl:text-3xl max-w-[50%]">Temukan kandidat talenta yang sesusai dengan anda</p>
                    <Space>
                        <Link to={`${SIGN_IN_PATH}?redirect=${CREATE_POST_PATH}&as=${OWNER}`}>
                            <button
                                className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                                type="button"
                            >
                                create task
                                <BsArrowRight className="ml-2" />
                            </button>
                        </Link>
                        <Link to={`${SIGN_IN_PATH}?as=${OWNER}`}>
                            <button
                                className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                                type="button"
                            >
                                find service
                                <BsArrowRight className="ml-2" />
                            </button>
                        </Link>
                    </Space>
                </div>
            </section>
            <p className="text-center my-10">Copyright@CapstoneDicoding2022</p>
        </div>
    );
}

export default HomeNotSignIn;
