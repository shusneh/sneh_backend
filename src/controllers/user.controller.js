import {asynHandlers} from  "../utils/asyncHandlers"

const registerUser=asynHandlers(async (req,res)=>{
   res.status(200).json({
        message:"ok"
    })
})

export {registerUser}