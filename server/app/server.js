const express = require('express');
const app = express();
const contractRoute = require('./routes/contract');
const customerRoute = require('./routes/customer');
const productRoute = require('./routes/product');
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Hello World");
})
app.use("/contract",contractRoute);
app.use("/customer", customerRoute);
app.use("/product",productRoute);
const port = 4001;
app.listen(port,()=>console.log(`listen on port ${port}`));