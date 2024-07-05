import { Server } from "./src/server";
import { Common } from "./src/helper/common";
import { Environments } from "./src/enviroment";

const server = new Server();

server.listen(port => {
  const common = new Common();
  common.showLogMessage(`Server listen in http://${Environments.HOST}:${port}`);
});

export default server;