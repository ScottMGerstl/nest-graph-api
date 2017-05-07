import { ResponseUtils } from '../../framework/utils/response.utils';

export abstract class BaseController {
    public createErrorResponse(res: Response, err: any) {
        return ResponseUtils.createErrorResponse(res, err);
    }
}