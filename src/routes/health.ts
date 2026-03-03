import Express from "express"
import { simpleSeverHealthInfo } from "../modules/health/simpleHealth";
import { detailedSeverHealthInfo } from "../modules/health/detailedHealth";

const healthRouter = Express.Router();

healthRouter.get("/", simpleSeverHealthInfo);
healthRouter.get('/detailed', detailedSeverHealthInfo);

export default healthRouter;