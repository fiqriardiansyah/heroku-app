export default {};

export interface FDataIntroduction {
    title: string;
    category: number;
    sub_category: number;
    price: number | string;
    tags: string[];
}

export interface FDataExplainIt {
    description: string;
}

export interface FDataConvince {
    images: File[] | any[];
    pdfs: File[] | any[];
}