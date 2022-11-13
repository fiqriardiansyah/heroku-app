export default {};

export interface FDataIntroduction {
    title: string;
    category: string;
    sub_category: string;
    price: number | string;
    tags: string[];
}

export interface FDataExplainIt {
    description: string;
}

export interface FDataConvince {
    images: File[];
    pdfs: File[];
}