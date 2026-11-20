import { Schema, model, connect, Mongoose } from 'mongoose';
import { logger } from '../middlewares/log';
import { MongoInfo } from '../interfaces/MongoInfo';
export class MongoDB {
    
    DB: Mongoose | void | undefined
    isConneted : boolean = false;

    constructor(info: MongoInfo) {

        const url = `mongodb://${info.name}:${encodeURIComponent(info.password)}@${info.host}:${info.port}/${info.dbName}`;

        this.init(url).then(() => {
            this.isConneted = true;
            logger.info(`success: connected to MongoDB database ${info.dbName}`);
        }).catch(() => {
            this.isConneted = false;
            logger.error('error: cannot connect to MongoDB');
        })

    }

    async init(url: string) {
        this.DB = await connect(url);
    }

    getState():boolean{
        return this.isConneted;
    }
}

