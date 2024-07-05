import { Sequelize } from "sequelize";
import { Logger } from "../helper/common";
import { Environments } from "../enviroment";

export class Connection {
  public traceId?: string;
  private static instance: Connection;
  public db?: Sequelize;

  /**
   * Obtiene la instancia de la clase
   */
  public static getInstance(): Connection {
    if (!Connection.instance) {

      Connection.instance = new Connection();

      Connection.instance.db = new Sequelize(Environments.DB, Environments.USER_DB as string, Environments.PASS_DB, {
        host: Environments.HOST_DB,
        dialect: 'mysql',
        define: {
          timestamps: false,
        },
        port: Environments.PORT_DB,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logging: (sql: any, value: any) => {
          // If enabled logs
          if (Environments.SHOW_LOGS === 'true')
            new Logger(value?.model?.traceId || Connection.instance.traceId).log('Sequelize query', sql);
        },
        pool: {
          max: 10,
          min: 0,
          acquire: 60000,
          idle: 10000,
        },
      });
      // console.log('Connection.instance.db', Connection.instance.db);
    }

    return Connection.instance;
  }
}
