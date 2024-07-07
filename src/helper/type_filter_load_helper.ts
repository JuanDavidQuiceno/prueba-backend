/* eslint-disable @typescript-eslint/no-explicit-any */

export class TypeFilterLoadHelper {
    // hacer mejora para obtener el tipo de archivo desde el mime type
    public fileVideos = (req: any, file: any, cb: any) => {
        const allowedExts = ['.mp4'];
        const fileParts = file.originalname.split('.');
        const fileType = `.${fileParts[fileParts.length - 1]}`;

        if (allowedExts.includes(fileType)) {
            return cb(null, true);
        }

        return cb(new Error('Formato de video no válido'), false);
    };
}