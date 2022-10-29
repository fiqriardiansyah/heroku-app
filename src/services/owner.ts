import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";

class OwnerService {
    config: FirebaseApp;

    constructor(config: FirebaseApp) {
        this.config = config;
    }
}

const ownerService = new OwnerService(configFirebase.app);
export default ownerService;
