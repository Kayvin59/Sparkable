import { LinkDto } from '../models/LinkDto';

export interface LinkRepository {
    getAllLinks: (sort?:string, categories?:string) =>  Promise<[LinkDto[], number]>
    getLinkById: (id:number) =>  Promise<LinkDto | null>
}