import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";

class ChatService {
    config: FirebaseApp;

    constructor(config: FirebaseApp) {
        this.config = config;
    }
}

const chatService = new ChatService(configFirebase.app);
export default chatService;
