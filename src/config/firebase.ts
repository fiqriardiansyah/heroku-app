import { FirebaseApp, initializeApp } from "firebase/app";

class ConfigFirebase {
    firebaseConfig: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
    };

    app: FirebaseApp;

    constructor() {
        this.firebaseConfig = {
            apiKey: process.env.REACT_APP_API_KEY as string,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN as string,
            projectId: process.env.REACT_APP_PROJECT_ID as string,
            storageBucket: process.env.REACT_APP_STORAGE_BUCKET as string,
            messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID as string,
            appId: process.env.REACT_APP_APP_ID as string,
        };
        this.app = initializeApp(this.firebaseConfig);
    }
}

const configFirebase = new ConfigFirebase();
export default configFirebase;
