import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Environments } from '../enviroment';
interface IAwsUpload {
    nameImage: string;
    paramsBucket?: string | undefined | null;
    route?: string | undefined | null;
    paramsBody: any;
    paramsContentType: string;
}

// Definición de interfaz para la operación de actualización
interface IUpdateImage {
    newNameImage: string;
    paramsBucket?: string | undefined | null;
    oldNameImage?: string | undefined | null; // Nombre de la imagen a eliminar (opcional)
    newParamsBody: string; // Nuevo cuerpo/base64 de la imagen
    newParamsContentType: string; // Nuevo tipo de contenido de la imagen
    newRoute?: string | undefined | null; // Nueva ruta para la imagen (opcional)
}

// Definición de interfaz para la operación de eliminación
interface IDeleteImage {
    paramsBucket?: string | undefined | null;
    paramsKey: string;
}

export class AwsUpload {

    public async upload({ nameImage, paramsBucket, paramsBody, paramsContentType, route }: IAwsUpload) {

        const accessKeyId = Environments.AWS_ACCESS_KEY;
        const secretAccessKey = Environments.AWS_SECRET_ACCESS_KEY;
        const region = Environments.AWS_REGION;
        const bucket = Environments.AWS_BUCKET;
        const s3 = new S3Client({
            credentials: {
                accessKeyId: accessKeyId || 'TU_ACCESS_KEY_ID',
                secretAccessKey: secretAccessKey || 'TU_SECRET_ACCESS_KEY'
            },
            region: region || 'TU_REGION'
        });
        const imageNameFormat = `${Date.now().toString()}-${nameImage}`;

        //   // Configura los parámetros para la operación de carga en S3
        try {
            const params = {
                Bucket: paramsBucket || bucket || 'TU_BUCKET',
                Key: route === null || route === undefined || route === '' ? imageNameFormat : `${route}/${imageNameFormat}`,
                Body: Buffer.from(paramsBody, 'base64'),
                ContentType: paramsContentType,
            };

            console.log('params', params);
            // Utiliza el comando PutObjectCommand del SDK v3 para cargar el archivo en S3
            await s3.send(new PutObjectCommand(params));
            return `https://${bucket}.s3.${Environments.AWS_REGION}.amazonaws.com/${params.Key}`;
        } catch (error) {
            // console.error('Error al subir la imagen a S3:', error);
            throw new Error('Error al subir la archivo: ' + error);
        }
    }

    public async deleteUploadImage({ paramsBucket, newNameImage, newParamsBody, newParamsContentType, newRoute, oldNameImage }: IUpdateImage) {
        if (oldNameImage !== null && oldNameImage !== undefined) {
            // Elimina la imagen existente
            await this.deleteImage({
                paramsKey: oldNameImage
            });
        }

        return await this.upload({
            nameImage: newNameImage,
            paramsBucket,
            route: newRoute,
            paramsBody: newParamsBody,
            paramsContentType: newParamsContentType,

        });
    }

    public async deleteImage({ paramsBucket, paramsKey }: IDeleteImage) {
        const accessKeyId = Environments.AWS_ACCESS_KEY;
        const secretAccessKey = Environments.AWS_SECRET_ACCESS_KEY;
        const region = Environments.AWS_REGION;
        const bucket = Environments.AWS_BUCKET;
        const s3 = new S3Client({
            credentials: {
                accessKeyId: accessKeyId || 'TU_ACCESS_KEY_ID',
                secretAccessKey: secretAccessKey || 'TU_SECRET_ACCESS_KEY'
            },
            region: region || 'TU_REGION'
        });

        // Configura los parámetros para la operación de eliminación en S3
        const deleteParams = {
            Bucket: paramsBucket || bucket || 'TU_BUCKET',
            Key: paramsKey, // La clave del objeto que deseas eliminar
        };

        try {
            // Utiliza el comando DeleteObjectCommand del SDK v3 para eliminar el archivo en S3
            await s3.send(new DeleteObjectCommand(deleteParams));
            console.log(`Imagen eliminada: ${paramsKey}`);
        } catch (error) {
            // console.error('Error al eliminar la imagen de S3:', error);
            throw new Error('Error al eliminar la imagen de S3');
        }
    }

    // private fileFilter = (req: any, file: any, cb: any) => {
    //     const allowedExts = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.mp4', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv'];
    //     const fileParts = file.originalname.split('.');
    //     const fileType = `.${fileParts[fileParts.length - 1]}`;

    //     if (allowedExts.includes(fileType)) {
    //         return cb(null, true);
    //     }

    //     return cb(new Error('Formato de archivo no válido'), false);
    // };

    // private s3 = new S3Client({ region: EnvironmentVariables.AWS_REGION });

    // private s3Upload = new AWS.S3({
    //     secretAccessKey: EnvironmentVariables.AWS_SECRET_ACCESS_KEY,
    //     accessKeyId: EnvironmentVariables.AWS_ACCESS_KEY,
    //     region: EnvironmentVariables.AWS_REGION,
    // });

    // public upload = multer({
    //     fileFilter: this.fileFilter,
    //     storage: multerS3({
    //         s3: this.s3,
    //         acl: 'public-read',
    //         bucket: EnvironmentVariables.AWS_BUCKET || '',
    //         contentType: multerS3.AUTO_CONTENT_TYPE,
    //         metadata: function (req: any, file: any, cb: any) {
    //             cb(null, { fieldName: file.fieldname });
    //         },
    //         key: function (req: any, file: any, cb: any) {
    //             cb(null, `${Date.now().toString()}-${file.originalname}`);
    //         },
    //     }),
    //     limits: {
    //         fileSize: 8000000 // Compliant: 8MB
    //     }
    // });

    // public eraseArrayOfPhotographs = async (photos: any) => {
    //     this.s3Upload.deleteObjects({ Bucket: EnvironmentVariables.AWS_BUCKET || '', Delete: { Objects: photos, Quiet: false } }, function (err: any, data: any) {
    //         if (err) console.error('err =>', err);
    //     });
    // };


}