const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.json());

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
connection.connect((err)=>{
    if (err) 
        console.log(err);
    else
        console.log("Connected!");
    var sql = `create table contract(
        id varchar(20) primary key,
        title varchar(50) not null,
        customerId varchar(10) not null references customer(id),
        softwareId varchar(10) not null references software(id),
        totalAmount float not null,
        date varchar(15)
    )`;
    //  connection.query(sql,(err,res)=>{
    //     if(err)
    //         console.log(err)
    //     else
    //         console.log("Success");
    // })
});

app.get("/", (req,res)=>{
    res.send("Hello World");
})

app.get("/api",(req,res)=>{
    res.json({success:true,message:"Hello World"})
})

app.get("/test",(req,res)=>{
    res.json({success:true,message:"Test"});
})

const port = 4001;
app.listen(port,()=>console.log(`listen on port ${port}`));