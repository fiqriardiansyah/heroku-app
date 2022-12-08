import React from "react";
import { Button, Space } from "antd";
import { BsArrowRight } from "react-icons/bs";

import HerokuImage from "assets/svgs/heroku-image.svg";
import Bg1 from "assets/images/bg-1.png";
import Bg2 from "assets/images/bg-2.png";

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
                        <button className="capitalize bg-primary border-none px-4 py-2 rounded-full text-white cursor-pointer" type="button">
                            create service
                        </button>
                        <Button type="text" className="!text-primary">
                            Need Help
                        </Button>
                    </Space>
                </div>
            </section>
            <section className="relative mt-10">
                <img src={Bg1} alt="create your poster service" className="w-full object-cover h-[400px] md:h-auto" />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-8">
                    <h2 className="text-white font-semibold text-base md:text-2xl xl:text-5xl max-w-[50%]">Create your poster service</h2>
                    <p className="text-white text-xs md:text-lg xl:text-3xl max-w-[50%]">Jual jasa keahlianmu dan tunjukkan pada dunia!</p>
                    <Space>
                        <button
                            className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                            type="button"
                        >
                            create service
                            <BsArrowRight className="ml-2" />
                        </button>
                        <button
                            className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                            type="button"
                        >
                            find work
                            <BsArrowRight className="ml-2" />
                        </button>
                    </Space>
                </div>
            </section>
            <section className="relative mt-20">
                <img src={Bg2} alt="create your poster service" className="w-full object-cover h-[400px] md:h-auto" />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-8 items-end">
                    <h2 className="text-white font-semibold text-base md:text-2xl xl:text-5xl max-w-[50%]">Find the right talent</h2>
                    <p className="text-white text-xs md:text-lg xl:text-3xl max-w-[50%]">Temukan kandidat talenta yang sesusai dengan anda</p>
                    <Space>
                        <button
                            className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                            type="button"
                        >
                            create task
                            <BsArrowRight className="ml-2" />
                        </button>
                        <button
                            className="flex items-center capitalize bg-primary border-none px-4 py-2 rounded-lg text-white cursor-pointer"
                            type="button"
                        >
                            find service
                            <BsArrowRight className="ml-2" />
                        </button>
                    </Space>
                </div>
            </section>
            <p className="text-center my-10">Copyright@CapstoneDicoding2022</p>
        </div>
    );
}

export default HomeNotSignIn;
