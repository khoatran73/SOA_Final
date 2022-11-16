import { AppUser } from "Auth/Identity";
import { Identifier } from "shared";

export interface INews  {
    id?: Identifier;
    categoryId?: Identifier;
    title?: string;
    price?: number;
    description?: string;
    imageUrls?: string[];
    userId?: Identifier;
}