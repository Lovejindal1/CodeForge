class ApiError extends Error {
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        Error.captureStackTrace(this,this.constructor);
    }
}
module.exports = ApiError;