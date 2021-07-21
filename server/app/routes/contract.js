const router = require("express").Router();
const mysql = require("mysql2");
let query;
const mysqlHost = 'localhost';
const mysqlPort = '3306';
const mysqlUser = 'root';
const mysqlPass = '123';
const mysqlDb = 'beexCRMDb';

const connectionOptions = {
    host: mysqlHost,
    port: mysqlPort,
    user: mysqlUser,
    password: mysqlPass,
    database: mysqlDb
}

const connection = mysql.createConnection(connectionOptions);

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