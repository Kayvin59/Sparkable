import { ViewedLinkByUserData } from "../../../domain/models/ViewedLinkByUserData";
import { ViewedLinkByUserDataDto } from "../../../domain/models/ViewedLinkByUserDataDto";
import { ViewedLinkByUserDataRepository } from "../../../domain/repositories/ViewedLinkByUserDataRepository";

export class ViewedLinkByUserDataRepositoryInMemory implements ViewedLinkByUserDataRepository {
  collection: ViewedLinkByUserDataDto[];

  constructor() {
    this.collection = [];
  }

  store(data: ViewedLinkByUserData){
    this.collection.push(data.toDto());
  }

  findData(params: Object): Promise<ViewedLinkByUserDataDto | null> {
    if (this.collection.length) {
      return new Promise((resolve) => resolve(this.collection[0]));
    } else {
      return new Promise((resolve) => resolve(null));
    }
  }

  getAllData(params: Object): Promise<[ViewedLinkByUserDataDto[], number]> {
    return new Promise((resolve) => resolve([this.collection, this.collection.length]));
  }

}