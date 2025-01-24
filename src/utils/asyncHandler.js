const asyncHandler = (requestHandler) => (req, res, next) => {
    return Promise.resolve(requestHandler(req, res, next)).
    catch((error) => next(error))
}


export {asyncHandler}

// const asyncHandler = (requestHandler) => (req, res, next) => {
//     try {
//         await requestHandler(req, res, next)
//     } catch (err) {
//     res.status(err.code || 500).json({
//         success : false,
//         message : err.message
//     })
//     }
// }