import app from "../../app";
import request from "supertest";
import dataSource from "../../data-source"
import { LinkEntity } from "../../contexts/links/infrastructure/persistence/entities/LinkEntity";
import { LinkDtoFactory } from "../../factories/linkDtoFactory"

describe("GET /links", () => {

    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        const repository = dataSource.getRepository(LinkEntity);
        await repository.clear();
    });

    it("returns 200 and empty response when does not exist links", async () => {
        const res = await request(app).get("/links");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({links:[], total:0});
    });

    it("returns 200 with link when exists one", async () => {
        const repository = dataSource.getRepository(LinkEntity);
        const linkDto = LinkDtoFactory.create();
        repository.save(linkDto);

        const res = await request(app).get("/links");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(1);
        expect(res.body.links[0].link).toEqual(linkDto.link);
        expect(res.body.links[0].hasOwnProperty('date')).toBe(true)
        expect(res.body.links[0].hasOwnProperty('uuid')).toBe(true)
    });

    it("returns 200 with multipe links when exist two", async () => {
        const repository = dataSource.getRepository(LinkEntity);
        const linkDto = LinkDtoFactory.create('First link');
        await repository.save(linkDto);
        const linkDto2 = LinkDtoFactory.create('Second link');
        await repository.save(linkDto2);

        const res = await request(app).get("/links");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(2);
    });

    // it("returns 200 sorted randomly by default", async () => {
    //     const repository = dataSource.getRepository(LinkEntity);
    //     const linkDto = LinkDtoFactory.create();
    //     repository.save(linkDto);
    //     repository.save(linkDto);

    //     const res = await request(app).get("/links");

    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body.total).toEqual(2);
    // });

    it("returns 200 sorted by newest first", async () => {
        const repository = dataSource.getRepository(LinkEntity);

        const titleFirstLink = 'First link';
        const linkDto = LinkDtoFactory.create(titleFirstLink);
        await repository.save(linkDto);

        const titleSecondLink = 'Second link';
        const linkDto2 = LinkDtoFactory.create(titleSecondLink);
        await repository.save(linkDto2);

        const res = await request(app).get("/links?sort=-date");

        expect(res.statusCode).toEqual(200);
        expect(res.body.links[0].title).toEqual(titleSecondLink);
        expect(res.body.links[1].title).toEqual(titleFirstLink);
    });

});