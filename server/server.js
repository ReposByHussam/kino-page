import initApp from "./app.js";
import api from "./movies-backendAPI.js";

const app = initApp(api);

app.listen(5080);