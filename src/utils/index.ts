/* eslint-disable no-plusplus */
import { message } from "antd";
import { v4 as uuid } from 'uuid';
import type { RcFile } from "antd/es/upload/interface";
import moment from "moment";
import { LOCALE, VALUE_TOKEN } from "./constant";

export default class Utils {
    static charCodeA = 65;

    static convertToStringFormat(num?: number | null): string {
        if (num === null || num === undefined) return "-";
        const mergeNum = num?.toString().split(".").join("");
        return mergeNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    static convertToIntFormat(str?: string): number {
        if (str === null || str === undefined) return 0;
        return parseInt(str.toString().split(".").join(""), 10);
    }

    static cutText(length: number, string?: string): string {
        if (!string) return "-";
        return string?.length > length ? `${string.slice(0, length)}...` : string;
    }

    static imageSafety(image: string | undefined | null): string {
        return image ?? "/images/placeholder.png";
    }

    static currencyFormatter = (selectedCurrOpt: any) => (value: any) => {
        return new Intl.NumberFormat(LOCALE, {
            style: "currency",
            currency: selectedCurrOpt.split("::")[1],
        }).format(value);
    };

    static currencyParser = (value: any) => {
        let newValue = value;
        try {
            // for when the input gets clears
            if (typeof value === "string" && !value.length) {
                newValue = "0.0";
            }

            // detecting and parsing between comma and dot
            const group = new Intl.NumberFormat(LOCALE).format(1111).replace(/1/g, "");
            const decimal = new Intl.NumberFormat(LOCALE).format(1.1).replace(/1/g, "");
            let reversedVal = newValue.replace(new RegExp(`\\${group}`, "g"), "");
            reversedVal = reversedVal.replace(new RegExp(`\\${decimal}`, "g"), ".");
            //  => 1232.21 €

            // removing everything except the digits and dot
            reversedVal = reversedVal.replace(/[^0-9.]/g, "");
            //  => 1232.21

            // appending digits properly
            const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
            const needsDigitsAppended = digitsAfterDecimalCount > 2;

            if (needsDigitsAppended) {
                reversedVal *= 10 ** (digitsAfterDecimalCount - 2);
            }

            return Number.isNaN(reversedVal) ? 0 : reversedVal;
        } catch (error) {
            console.error(error);
            return 0;
        }
    };

    static getBase64 = (data: RcFile | File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result as string));
        reader.readAsDataURL(data);
    };

    static beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("Format gambar hanya boleh jpg/jpeg/png");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Ukuran gambar tidak boleh lebih dari 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    static parseTreeObjectToArray<T>(obj: any): T[] {
        if (!obj) return [];
        const parse = Object.keys(obj).map((key) => ({
            ...obj[key],
            id: key,
        })) as T[];
        return parse as T[];
    }

    static onPaste = (e: any): Promise<any> | null => {
        if (!(e.clipboardData && e.clipboardData.items)) return null;
        return new Promise((resolve, reject) => {
            for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
                const item = e.clipboardData.items[i];
                if (item.kind === 'string') {
                    item.getAsString((str: any) => resolve({ type: 'text', value: str }));
                } else if (item.kind === 'file') {
                    const pasteFile = item.getAsFile();
                    resolve({ type: 'file', value: pasteFile });
                } else {
                    reject(new Error('Not allow to paste this type!'));
                }
            }
        });
    }

    static removeDashes(str: string) {
        return str.split('-').join('');
    }

    static createChatId({ postfix, uids }: { uids: string[], postfix: string }) {
        return this.removeDashes(uids.sort().join('') + postfix);
    }

    static stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    static isDifferentDate = ({ prevTime, time }: { prevTime: any, time: any }) => {
        return moment(prevTime || moment.now()).isSame(time, 'date');
    }

    static generateFileName({ file }: { file: File }) {
        const extension = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
        return `${uuid()}.${extension}`;
    }

    static convertToToken(total: number) {
        return Math.round(total / VALUE_TOKEN);
    }

}
