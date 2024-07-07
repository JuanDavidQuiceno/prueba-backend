/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request, NextFunction } from "express";

import VideosModel from "../models/videos";
import { TypeFilterLoadHelper } from "../helper/type_filter_load_helper";
import { AwsUpload } from "../helper/aws_document";
import { Utils } from "../helper/utils";

export class Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
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
          },
          attributes: { exclude: ['active', 'user_id', 'updated_at'] },
          order: [['id', 'DESC']]
        });

        const response = {
          result: results,
          meta: {
            total: results.count,
            page,
          },
        };
        return res.status(200).json(response);
      }
    } catch (error) {
      return new Utils().errorCatch(error, next, res);
    }

  }

  async getAllMyVideos(req: any, res: Response, next: NextFunction) {

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
          attributes: { exclude: ['active', 'user_id', 'updated_at'] },
          //reverse: true
          order: [['id', 'DESC']]
        });

        const response = {
          result: results,
          meta: {
            total: results.count,
            page,
          },
        };
        return res.status(200).json(response);
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

      // utilizamos rutaLogo para asignarle el valor de la ruta del logo
      const urlVideo = await new AwsUpload().upload({
        nameImage: rutaVideo.originalname,
        route: 'videos',
        paramsBody: rutaVideo.buffer,
        paramsContentType: rutaVideo.mimetype,
      });

      const { title, description } = req.body;
      await VideosModel().create({
        title,
        description,
        user_id: req.user.id,
        url: urlVideo,
      });

      return res.status(201).json({
        ok: true,
        message: 'Se guardo correctamente toda la informacion',
      });
    } catch (error: any) {
      // Si hay error
      if (error.message) {
        return res.status(400).json({ message: 'Error controlado auth', error: error.message });
      }
      else {
        return res.status(500).json({ message: 'Error controlado auth,', error: error });
      }
    }
  }

  async delete(req: any, res: Response) {

    const language = res.locals.language;
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const video = await VideosModel().findByPk(id);

      if (!video) {
        return res.status(404).json({
          message: language === 'en'
            ? `The requested resource with id ${id} was not found`
            : language === 'fr'
              ? `La ressource demandée avec l'identifiant ${id} n'a pas été trouvée`
              : `No se encuentra el recurso solicitado con el id ${id}`
        });
      }

      console.log(video.dataValues.user_id, userId);
      console.log('idVideo', id)

      if (video.dataValues.user_id?.toString() !== userId) {
        return res.status(401).json({
          message: language === 'en'
            ? `You are not authorized to delete this resource`
            : language === 'fr'
              ? `Vous n'êtes pas autorisé à supprimer cette ressource`
              : `No tienes permisos para eliminar este recurso`
        });
      }

      await VideosModel().update({ active: false }, { where: { id } });

      return res.status(200).json({

        message: language === 'en'
          ? `Resource with id ${id} successfully deleted`
          : language === 'fr'
            ? `Ressource avec id ${id} supprimée avec succès`
            : `Recurso con id ${id} eliminado correctamente`
      });

    } catch (error: any) {

      // Si hay error
      if (error.message) {
        return res.status(400).json({ message: 'Error controlado auth', error: error.message });
      }
      else {
        return res.status(500).json({ message: 'Error controlado auth,', error: error });
      }
    }
  }
}