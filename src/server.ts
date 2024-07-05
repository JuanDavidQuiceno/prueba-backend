import { createServer, Server as HTTPServer } from "http";
import express, { Application, Request, Response, NextFunction } from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import { Sequelize } from "sequelize";
import { Connection } from "./db/connection";
import multer from "multer";


// Middlewares
import { NotFoundMiddleware } from "./middleware/notFoundHandler";

// Rutas
import authRoutes from "./routes/auth";
import videosRoutes from "./routes/videos";
import { Environments } from "./enviroment";
import { ErrorMiddleware } from "./middleware/errorHandler";
import { Language } from "./middleware/languaje";


export class Server {

  private app: Application = express();
  private httpServer: HTTPServer = createServer(this.app);

  private initialize(): void {

    // Inicia la configuración de la app
    this.initApp();
    this.configureRoutes();
    this.dbConnection();
    // Inicia los middelwares
    this.mountMiddlewares();
  }

  /**
   * Inicia la aplicación
   */
  private initApp(): void {

    this.app.disable("x-powered-by");
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(cors({
      exposedHeaders: ['Authorization', 'authorization', 'Content-Length'],
    }));
    this.app.use(new Language().setLanguage);

    // Establece las respuestas del header
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      next();
    });

    Environments.checkRequiredVariables();

    // // Add logger
    // this.app.use(loggerMiddleware);
  }

  async dbConnection() {
    try {
      await (Connection.getInstance().db as Sequelize).authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  /**
   * Establece las rutas
   */
  private mountMiddlewares(): void {

    // const errorMid = new ErrorMiddleware();
    const notFound = new NotFoundMiddleware();

    // 404
    this.app.use(notFound.notFountHandler);

    const errorMid = new ErrorMiddleware();
    // Log de las peticiones
    this.app.use(errorMid.logRequestMiddleware);

    // // Manejo de errores
    // this.app.use(errorMid.logErrors);
    // this.app.use(errorMid.wrapErrors);
    // this.app.use(errorMid.errorHandler);
  }

  /**
   * Inicia las rutas
   */
  private configureRoutes(): void {
    // ruta get
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Verificación de funcionamiento de ruta");
    });

    // verificar si la peticion es de tipo form-data
    // Configuración de multer para manejar form-data
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    // Middleware para procesar form-data
    this.app.use(upload.any());
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/videos", videosRoutes);
  }

  /**
   * Inicia el listener del server
   * @param callback 
   */
  public listen(callback: (port: number) => void): void {
    const port = Environments.PORT;
    this.httpServer.listen(port, () => {
      callback(port);
      this.initialize();
    });
  }

  public close() {
    this.httpServer.close();
  }
}