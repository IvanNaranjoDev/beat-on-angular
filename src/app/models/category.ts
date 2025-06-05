import { Sound } from "./sound";

export interface Category {
    id?: number;
    name: string;
    color: string;
    icon_url: string;
    sounds?: Sound[]; 
}