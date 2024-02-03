const asyncHandlers=(requestFunc)=>{
    (req,res,next)=>{
        Promise.resolve(requestFunc(req,res,next)).catch((err)=>next(err));
    }
}






// const asyncHandlers=(fn) => async (req,res,next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code||400).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

export default asyncHandlers;