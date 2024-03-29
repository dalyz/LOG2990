import { injectable } from 'inversify';
import { Db, MongoClient, MongoError, ObjectID } from 'mongodb';
import 'reflect-metadata';
import { Drawing } from '../../../client/src/services/draw-area/i-drawing';
@injectable()
export class DatabaseService {

    private readonly DB_URL = 'mongodb+srv://dapak:rebase8@rebase-67b9x.mongodb.net/test';
    private mongo: MongoClient;
    private db: Db;

    private async connectDB(): Promise<MongoClient> {
        if (this.mongo !== undefined) { return this.mongo; }
        this.mongo = await MongoClient.connect(this.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return this.mongo;
    }

    async addDrawing(drawing: Drawing): Promise<void> {
        this.db = (await this.connectDB()).db('Rebase08');
        this.db.collection('Drawing').insertOne(drawing);
    }

    async deleteDrawing(id: string): Promise<void> {
        this.db = (await this.connectDB()).db('Rebase08');
        this.db.collection('Drawing').deleteOne({ _id: new ObjectID(id) });
    }

    async getAllDrawings(): Promise<Drawing[]> {
        this.db = (await this.connectDB()).db('Rebase08');

        return new Promise<Drawing[]>((
            resolve: (value?: Drawing[] | PromiseLike<Drawing[]> | undefined) => void,
            reject: (reason?: any) => void) => {

            this.db.collection('Drawing').find().toArray((err: MongoError, result: Drawing[]) => {
                err
                    ? reject(err)
                    : resolve(result);
            });
        });
    }

    async updateTags(id: string, tag: string): Promise<void> {
        this.db = (await this.connectDB()).db('Rebase08');
        this.db.collection('Drawing').findOneAndUpdate(
            { _id: new ObjectID(id) },
            { $push: { tags: tag }, },
        );
    }

    async updateTime(id: string): Promise<void> {
        this.db = (await this.connectDB()).db('Rebase08');
        this.db.collection('Drawing').findOneAndUpdate(
            { _id: new ObjectID(id) },
            { $set: { createdAt: new Date() }, },
        );
    }

}
