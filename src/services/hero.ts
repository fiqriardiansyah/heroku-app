import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";

class HeroService {
    config: FirebaseApp;

    constructor(config: FirebaseApp) {
        this.config = config;
    }
}

const heroService = new HeroService(configFirebase.app);
export default heroService;
