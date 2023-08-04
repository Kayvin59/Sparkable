import { CheckUserExistsService } from '../../_shared/domain/services/CheckUserExistsService';
import { MailerService } from '../../users/domain/services/MailerService';
import { CategoryNotFoundException } from '../domain/exceptions/CategoryNotFoundException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { Link } from '../domain/models/Link';
import { CategoryRepository } from '../domain/repositories/CategoryRepository';
import { LinkRepository } from '../domain/repositories/LinkRepository';

export class CreateLinkAction {
  private linkRepository: LinkRepository;
  private categoryRepository: CategoryRepository;
  private checkUserExistsService: CheckUserExistsService;
  private mailerService: MailerService;

  constructor(
    linkRepository: LinkRepository,
    categoryRepository: CategoryRepository,
    checkUserExistsService: CheckUserExistsService,
    mailerService: MailerService
  ) {
    this.linkRepository = linkRepository;
    this.categoryRepository = categoryRepository;
    this.checkUserExistsService = checkUserExistsService;
    this.mailerService = mailerService;
  }

  async execute(linkData: any) {
    const link = new Link(linkData);
    await this.checkExistsCategories(link);
    const user = await this.checkUserExistsService.execute(link.userUuid);
    await this.checkUrlIsNew(link);
    link.username = user.username;
    const linkId = await this.linkRepository.storeLink(link);
    link.setId(linkId);
    this.sendEmail(link);
  }

  private async checkUrlIsNew(linkData: any) {
    const linkExists = await this.linkRepository.findLink('url', linkData.url);
    if (linkExists)
      throw new LinkExistsException();
  }

  private async checkExistsCategories(link: Link) {
    for (let index = 0; index < link.categories.length; index++) {
      const categoryDto = link.categories[index];
      const category = await this.categoryRepository.findCategoryById(categoryDto.id);
      if (category === null)
        throw new CategoryNotFoundException();
    }
  }

  private async sendEmail(link: Link) {
    const href = `${process.env.CLIENT}/article/${link.id}}`;

    const mailOptions = {
      from: 'support@sparkable.cc',
      to: 'support@sparkable.cc',
      subject: 'New link has been created!',
      html: `
        <html>
        <head>
            <style>
            </style>
        </head>
        <body>
            <p>A new link has been created!</p>
            <p><a href="${href}">${link.title}</a></p>
        </body>
        </html>
        `,
    };

    this.mailerService.sendEmail(mailOptions);
  }

}