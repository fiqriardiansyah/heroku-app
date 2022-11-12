import React from "react";

import HerokuImage from "assets/svgs/heroku-image.svg";

function Footer() {
    return (
        <div className="w-full bg-primary py-10">
            <div className="CONTAINER grid grid-cols-1 md:grid-cols-2">
                <div>
                    <img src={HerokuImage} alt="heroku" className="w-full md:w-auto" />
                </div>
                <div>
                    <h2 className="text-white font-semibold">Heroku - Get work done</h2>
                    <p className="text-white capitalize m-0">creator:</p>
                    <ul className="text-white">
                        <li>
                            <a href="mailto:fiqriardian92@gmail.com" className="text-white">
                                Fiqri Ardiansyah
                            </a>
                        </li>
                        <li>
                            <a href="mailto:beryl.naga@gmail.com" className="text-white">
                                Azaria Beryl Nagata
                            </a>
                        </li>
                        <li>
                            <a href="mailto:abdwasidev@gmail.com" className="text-white">
                                Abdul Wasi Al-Afif
                            </a>
                        </li>
                        <li>
                            <a href="mailto:rossadwi19@gmail.com" className="text-white">
                                Rossa Dwi Sukmawati
                            </a>
                        </li>
                    </ul>
                    <p className="m-0 mt-5 ">Copyright@CapstoneDicoding2022</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
