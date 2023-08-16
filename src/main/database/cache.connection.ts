import { Redis } from "ioredis";
import config from "../config/redis.config";

export class CacheDatabase {
  private static _connection: Redis;

  // CHAMA NO INDEX
  public static async connect() {
    this._connection = new Redis(config);
    console.log("CacheDatabase is connected");
  }

  // CHAMA NOS REPOSITORIOS
  public static get connection() {
    return this._connection;
  }
}
