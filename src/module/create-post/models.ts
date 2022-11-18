export default {};

export interface FDataPost {
    title: string;
    type_of_job: string;
    company?: string;
    price?: string;
    is_fixed_price?: string;
    description: string;
    category: string;
    skills: string[];
    number_of_hero?: number;
    limit_applicant?: number;
}