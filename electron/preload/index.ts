import { contextBridge } from "electron";
import api from "../api/index";

contextBridge.exposeInMainWorld("api",api);