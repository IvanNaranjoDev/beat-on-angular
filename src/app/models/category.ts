import { Sound } from "./sound";

export interface Category {
    id?: number;
    name: string;
    color: string;
    iconUrl: string;
    sounds?: Sound[]; 
}