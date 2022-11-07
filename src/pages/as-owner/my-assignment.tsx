import Layout from "components/common/layout";
import { Card, AutoComplete } from "antd";
import React, { useState } from "react";

const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
});

function MyAssignment() {
    const [value, setValue] = useState("");
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const onSearch = (searchText: string) => {
        setOptions(!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);
    };

    const onSelect = (data: string) => {
        console.log("onSelect", data);
    };

    const onChange = (data: string) => {
        setValue(data);
    };

    return (
        <Layout>
            <br />
            <Card title="Explore Services">
                <AutoComplete options={options} style={{ width: "100%" }} onSelect={onSelect} onSearch={onSearch} placeholder="Search Service" />
            </Card>
            <br />
            <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                <div className="mb-4 flex flex-col justify-center pb-10 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                    <div className=" m-4 flex flex-row">
                        <img
                            className="w-12 h-12 rounded-full shadow-lg"
                            src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                            alt=""
                        />
                        <div className="ml-3">
                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bonnie Green</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
                        </div>
                    </div>
                    <div className=" m-4 flex flex-col">
                        <img
                            className="rounded-lg"
                            src="https://www.wallpapers13.com/wp-content/uploads/2016/01/Sunset-desktop-background-498686-840x525.jpg"
                            alt=""
                        />
                        <br />
                        <p className="text-gray-900 dark:text-white text-sm font-bold">
                            Some quick example text to build on the card title and make up the bulk of the cards content.
                        </p>

                        <p className="text-gray-400 dark:text-white mb-4">
                            Some quick example text to build on the card title and make up the bulk of the cards content.
                        </p>
                        <p className="inline-flex py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                            Rp. 210.100,00
                        </p>
                    </div>
                </div>
                <div className="mb-4 flex flex-col justify-center pb-10 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                    <div className=" m-4 flex flex-row">
                        <img
                            className="w-12 h-12 rounded-full shadow-lg"
                            src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                            alt=""
                        />
                        <div className="ml-3">
                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bonnie Green</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
                        </div>
                    </div>
                    <div className=" m-4 flex flex-col">
                        <img
                            className="rounded-lg"
                            src="https://www.wallpapers13.com/wp-content/uploads/2016/01/Sunset-desktop-background-498686-840x525.jpg"
                            alt=""
                        />
                        <br />
                        <p className="text-gray-900 dark:text-white text-sm font-bold">
                            Some quick example text to build on the card title and make up the bulk of the cards content.
                        </p>

                        <p className="text-gray-400 dark:text-white mb-4">
                            Some quick example text to build on the card title and make up the bulk of the cards content.
                        </p>
                        <p className="inline-flex py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                            Rp. 210.100,00
                        </p>
                    </div>
                </div>
            </Card>
        </Layout>
    );
}

export default MyAssignment;
