FROM node:20.10.0

WORKDIR /app

## instalamos las dependencias de producción
# RUN npm install --only=production

CMD [ "npm", "run", "start_docker" ]