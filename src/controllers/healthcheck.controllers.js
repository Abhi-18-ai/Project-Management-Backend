import { ApiResponse } from "../utils/api-response.js";
import { asynchandler } from "../utils/async-handler.js";
// const healthCheck = (req, res) => {
//   try {
//     res
//       .status(200)
//       .json(new ApiResponse(200, { message: "😎server is working correctly" }));
//   } catch (error) {}
// };

const healthCheck = asynchandler(async(req,res,next)=>{
    res
       .status(200)
       .json(new ApiResponse(200, { message: "😎server is working correctly" }));
});

export { healthCheck };
