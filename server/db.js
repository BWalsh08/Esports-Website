import { MongoClient, ServerApiVersion } from 'mongodb';
import "dotenv/config";

//DZjnij1ZfFyWp4vA

export class ScrabbleDatabase {
    constructor(dburl) {
        this.dburl = dburl;
    }

    async connect() {
        this.client = await MongoClient.connect(this.dburl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverApi: ServerApiVersion.v1,
        });

        this.db = this.client.db('HW10');
    }

    async close() {
        this.client.close();
    }

    async createWordScore(name, word, score) {
        const res = await this.db.collection('wordScores').insertOne({name, word, score});
        return res;
    }
    async createGameScore(name, score) {
        const res = await this.db.collection('gameScores').insertOne({name, score});
        return res;
    }

    async readAllScores() {
        this.collection = this.db.collection('wordScores')
        const res = await this.collection.find({}).toArray();
        return res;
      }

    async readAllGames() {
        this.collection = this.db.collection('gameScores')
        const res = await this.collection.find({}).toArray();
        return res;
    }
}