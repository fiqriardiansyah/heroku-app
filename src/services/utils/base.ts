import { DEFAULT_ERROR } from "utils/constant";

class BaseService {

    async ProxyRequest<T>(request: () => Promise<T>): Promise<T> {
        try {
            return request();
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }

}

export default BaseService;
