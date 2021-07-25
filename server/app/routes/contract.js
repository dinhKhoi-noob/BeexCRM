const connection = require("./connection");
const router = require("express").Router();
const randomString = require("randomstring");

router.get("/",(req,res)=>{
    query = `select * from contract`;
    try 
    {
        connection.query(query,(error,result)=>{
            if(error) {
                console.log(error);
                res.status(404).json({success: false,message:"Not Found"});
            }
            if(res)
            {
                res.json({success:true,data:result,message:"Successfully"});
            }
        });
    } 
    catch (error) {
        res.status(500).json({success: false,message:"Internal Server Failed"});
    }
})


module.exports = router;