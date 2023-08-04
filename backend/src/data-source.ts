import { DataSource, DataSourceOptions } from "typeorm"
import "reflect-metadata";
import dotenv from 'dotenv';
import fs = require('fs');

dotenv.config();

let dataSource:any = undefined;

let options:any = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [__dirname + '/contexts/**/infrastructure/persistence/entities/*.{ts,js}'],
    subscribers: [],
    migrations: [__dirname + '/db/migrations/*.{ts,js}'],
    dropSchema: false
}

switch (process.env.NODE_ENV) {
    case 'prod':
        const pathSSLCert = process.env.SSL_CERT;
        if (pathSSLCert) {
            options.ssl = {ca: fs.readFileSync(pathSSLCert, 'utf-8').toString() };
            dataSource = new DataSource(options);
        }
        break;

    case 'test':
        dataSource = new DataSource({
            type: "postgres",
            host: "db",
            port: 5432,
            username: "test",
            password: "test",
            database: "test",
            synchronize: true,
            logging: false,
            entities: [__dirname + '/contexts/**/infrastructure/persistence/entities/*.{ts,js}'],
            subscribers: []
        });
        break;

    default: {
        dataSource = new DataSource(options);
        break;
    }
}

export default dataSource;