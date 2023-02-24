import { MandatoryFieldEmptyException } from '../../../users/domain/exceptions/MandatoryFieldEmptyException';
import { CategoryRestrictionException } from '../exceptions/CategoryRestrictionException';
import { CategoryDto } from './CategoryDto';
import { LinkDto } from './LinkDto';
import { v4 as uuidv4 } from 'uuid';

export class Link {
  id: number;
  title: string;
  url: string;
  categories: CategoryDto[];
  image: string;
  description: string;
  date: Date;
  uuid: string;
  username: string;
  userUuid: string;

  constructor(link: LinkDto) {
    if (Object.keys(link).length === 0) {
      throw new MandatoryFieldEmptyException();
    }

    if (!link.title || !link.url || !link.categories || !link.userUuid) {
      throw new MandatoryFieldEmptyException();
    }

    if (typeof link.categories === 'string') {
      link.categories = JSON.parse(link.categories);
    }

    link.categories.forEach(category => {
      if (!this.isACategoryDto(category)) {
        throw new MandatoryFieldEmptyException();
      }
    });

    if (link.categories.length > 2) {
      throw new CategoryRestrictionException();
    }

    this.title = link.title;
    this.url = link.url;
    this.categories = link.categories;
    this.userUuid = link.userUuid;
    this.image = link.image;
    this.description = link.description;
    this.date = new Date();
    this.username = link.username;
    this.uuid = uuidv4();
  }

  public static factory(linkDto: LinkDto): Link {
    return new Link(linkDto);
  }

  public toDto(): LinkDto {
    return {
      id: 0,
      uuid: this.uuid,
      title: this.title,
      url: this.url,
      image: this.image,
      description: this.description,
      date: this.date,
      categories: this.categories,
      userUuid: this.userUuid,
      username: this.username
    };
  }

  private isACategoryDto(object: any): object is CategoryDto {
    return Object.prototype.hasOwnProperty.call(object, 'id')
    && Object.prototype.hasOwnProperty.call(object, 'name')
    && Object.prototype.hasOwnProperty.call(object, 'slug');
  }

}