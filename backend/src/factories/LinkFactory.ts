import { LinkDto } from '../contexts/links/domain/models/LinkDto';
import { CategoryEntity } from '../contexts/links/infrastructure/persistence/entities/CategoryEntity';
import { LinkEntity } from '../contexts/links/infrastructure/persistence/entities/LinkEntity';
import dataSource from '../data-source';

export default class LinkFactory {
  private static readonly linkDto:LinkDto = {
    id: 0,
    title: 'title',
    uuid: 'uuid',
    username: 'admin',
    url: 'https://www.butterfy.me/',
    image:
      'https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/5fe2726881e6e52053a0217c_Butterfy_Logo-p-500.png',
    description: 'description',
    categories: [],
    userUuid: 'userUuid',
    date: new Date(),
    statement: 'Statement ...',
    suggestionCategory: 'Sports',
    stage: 2
  };

  public static async create(
    categories?: Array<CategoryEntity>,
    title?: string,
  ): Promise<LinkDto> {
    const linkRepository = dataSource.getRepository(LinkEntity);
    const link = linkRepository.create({ ...this.linkDto });

    if (title) {
      link.title = title;
    }

    if (categories) {
      link.categories = categories;
    }

    link.date = new Date();

    return await linkRepository.manager.save(link);
  }

  public static async createX(x: number, categories?: Array<CategoryEntity>) {
    for (let index = 0; index < x; index++) {
      await LinkFactory.create(categories, this.linkDto.title + index);
    }
  }

}