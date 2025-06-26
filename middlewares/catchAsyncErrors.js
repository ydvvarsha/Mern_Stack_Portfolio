export const catchAsyncErrors = (theFunction) => {
    return(req,res,next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
};
//if not resolve error catch its error and run further required code
//and code will not crash