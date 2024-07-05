/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request, NextFunction } from "express";

import { Utils } from "../helper/utils";
import VideosModel from "../models/videos";
import { TypeFilterLoadHelper } from "../helper/type_filter_load_helper";
import { ErrorClass, SuccessClass } from "../helper/default_class";
import { AwsUpload } from "../helper/aws_document";

export class Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
    new Utils().getAll(req, res, next, VideosModel(), {
      where: {
        active: true
      },
      attributes: { exclude: ['active', 'updated_at'] }
    });
  }

  async getAllMyVideos(req: any, res: Response, next: NextFunction) {
    // new Utils().getAll(req, res, next, VideosModel(), {
    //   where: {
    //     active: true,
    //     user_id: req.user.id
    //   },
    //   attributes: { exclude: ['active', 'updated_at'] }
    // });
    try {
      if (req.query.page === undefined || req.query.limit === undefined) {
        // solicitar los parametros de paginacion
        return res.status(400).json({
          success: false,
          message: 'page and limit is required'
        });

      } else {
        const { page, limit, offset } = new Utils().paginate(req);

        const results = await VideosModel().findAndCountAll({
          limit,
          offset,
          where: {
            active: true,
            user_id: req.user.id
          },
          attributes: { exclude: ['active', 'updated_at'] }
        });

        const response = {
          result: results,
          meta: {
            total: results.count,
            page,
          },
        };
        return res.status(200).json(new SuccessClass('', response));
      }
    } catch (error) {
      return new Utils().errorCatch(error, next, res);
    }
  }

  // async get(req: Request, res: Response, next: NextFunction) {
  //   new Utils().get(req, res, next, VideosModel());
  // }

  async add(req: any, res: Response) {

    const language = res.locals.language; // Obtener el idioma de la solicitud

    try {
      // verificamos que el archivo exista con la propiedad image
      if (!req.files) {
        return res.status(400).json({
          success: false,
          error_msg: 'No se ha enviado un archivo'
        });
      }

      // obtenemos los datos de files el fieldname image
      const rutaVideo = req.files.find((file: any) => file.fieldname === 'video');
      // obtenemos los datos de files el fieldname image

      if (!rutaVideo) return res.status(400).json({
        success: false,
        language: language,
        errors: [
          {
            msg: "video is required, Type mp4",
            param: "video",
            location: "body"
          }
        ]
      });

      new TypeFilterLoadHelper().fileVideos(res, rutaVideo, function (err: any) {
        // verificamos si err es diferente de null
        if (err instanceof Error) {
          throw err;
        }
      });

      const { title, description } = req.body;

      // utilizamos rutaLogo para asignarle el valor de la ruta del logo
      const urlVideo = await new AwsUpload().upload({
        nameImage: rutaVideo.originalname,
        route: 'videos',
        paramsBody: rutaVideo.buffer,
        paramsContentType: rutaVideo.mimetype,
      });


      const video = await VideosModel().create(
        {
          title,
          description,
          user_id: req.user.id,
          url: urlVideo,
        },
        // { transaction }
      );

      //incluimos la url del video en la respuesta video.dataValues
      video.dataValues.url = urlVideo;

      return res.status(201).json({
        ok: true,
        message: 'Se guardo correctamente toda la informacion',
        data: video,
      });
    } catch (error: any) {

      if (error.message) {
        return res.status(400).json(new ErrorClass('Error controlado auth', error.message));
      }
      else {
        return res.status(500).json(new ErrorClass('Error controlado auth,', error),);
      }
    }
  }

  // async update(req: Request, res: Response, next: NextFunction) {
  //   new Utils().update(req, res, next, VideosModel());
  // }

  async delete(req: Request, res: Response, next: NextFunction) {
    new Utils().delete(req, res, next, VideosModel());
  }
}