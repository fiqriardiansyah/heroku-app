import { User } from "models";

export interface FDataUser extends Pick<User, 'name' | 'profession'> {
    profile?: string;
}