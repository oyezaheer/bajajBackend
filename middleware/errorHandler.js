const { constants } = require("../constants");

const errorHandler = (err,req,res,next) => {
    const  statusCode = res.statusCode ? res.statusCode : 500;
    switch(statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({tittle:"Validation Failed",message:err.message, stackTrace: err.stackTrace });
        case constants.NOT_FOUND:
            res.json({tittle:"Not Found",message:err.message, stackTrace: err.stackTrace });
        default:
            break;

    }
};

module.exports = errorHandler;