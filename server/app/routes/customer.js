const connection = require("./connection");
const router = require("express").Router();
const randomString = require("randomstring");

router.get('/',(req, res)=>{
    query = "select * from customer";
    connection.query(query,(error,result)=>{
        if (error)
        {
            //Handle server error
            console.log(error);
            return res.status(404).json({success: false,message:"Not found"});
        }
        if(result)
        {
            //Filter result which have been active
            result = result.filter(customer=>
                customer.isActive === 1
            )
            if(result.length > 0)
                res.json({success:true,data:result,message:"Successfully"});
            else
                res.status(404).json({success: false,message:"Not found"});
        }
    })
})

router.get('/:id',(req, res)=>{
    const id = req.params.id;
    query = `select * from customer where customerId='${id}'`;
    connection.query(query,(error,result)=>
    {
        if(error)
        {
            //Handle server error
            console.log(error);
            return res.status(500).json({success:false,message:"Something went wrong",error});
        }
        if(result.length>0)
        {
            //Check if customer status (1: active,0: softdelete)
            if(result[0].isActive === 1)
                res.json({success:true,message:"Successfully",data:result});
            else
                res.status(404).json({success:false,message:"Not Found"});
        }
        else
        {
            res.status(404).json({success:false,message:"Not Found"});
        }
    })
})

router.post('/',(req,res)=>{
    const {address,name,phone,email} = req.body;
    //generate id
    const id = randomString.generate(10);
    const isActive = true;
    //Validate input data
    //Empty fields - too long values
    if(!address || !name || !phone || !email || address.length < 1 || name.length < 1)
        return res.status(403).json({success:false,message:"Please Enter All Fields"});
    if( address.length > 100 || name.length > 100 || phone.length > 11 || email.length > 40)
        return res.status(403).json({success:false,message:"Please Check your data carefully before send"});
    //Invalid fields
    const emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneFormat = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    //Invalid email
    if(!emailFormat.test(email))
        return res.status(403).json({success:false,message:"Invalid email"});
    //Invalid phone
    if(!phoneFormat.test(phone))
        return res.status(403).json({success:false,message:"Invalid phone number"});
    query = `insert into customer values ('${id}','${name}','${address}','${email}','${phone}',${isActive})`;
    connection.query(query,(error,result)=>{
        if(error)
        {
            console.log(error);
            return res.status(500).json({success:false,message:"Something went wrong"});
        }
        res.json({success:true,message:"Successfully",id});
    })
})

router.patch('/:id',(req,res)=>{
    const id = req.params.id;
    const {address,name,phone,email} = req.body;    
    //Validate input data
    //Empty fields
    if(!address || !name || !phone || !email || address.length < 1 || name.length < 1)
        return res.status(403).json({success:false,message:"Please Enter All Fields"});
    if( address.length > 100 || name.length > 100 || phone.length > 11 || email.length > 40)
        return res.status(403).json({success:false,message:"Please Check your data carefully before send"});
    //Invalid fields
    const emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneFormat = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    //Invalid email
    if(!emailFormat.test(email))
        return res.status(403).json({success:false,message:"Invalid email"});
    //Invalid phone
    if(!phoneFormat.test(phone))
        return res.status(403).json({success:false,message:"Invalid phone number"});
    query = `update customer set 
        address='${address}',
        name='${name}',
        phone='${phone}',
        email='${email}'
        where customerId='${id}'
        `;
    //Check if customer has already been existed
    connection.query(`Select * from customer where customerId='${id}'`,(error,result)=>{
        if(error){
            console.log(error);
            return res.status(500).json({success:false,message:"Something went wrong"});
        }
        //Existed
        if(result.length>0)
        {
            //Execute update command
            connection.query(query,(error,result)=>{
                if(error)
                {
                    //Handle server error
                    console.log(error);
                    return res.status(500).json({success:false,message:"Something Went Wrong"});
                }
                //All good
                res.json({success:true,message:"Successfully",id});
            })      
        }
        //Not existed
        else{
            res.status(404).json({success:false,message:"Not Found"});
        }
    })
})

router.patch('/remove/:id',(req,res)=>{
    const id = req.params.id;   
    query = `update customer set 
        isActive=false
        where customerId='${id}'
        `;
    //Check if customer has already been existed
    connection.query(`Select * from customer where customerId='${id}'`,(error,result)=>{
        if(error){
            //Handle server error
            console.log(error);
            return res.status(500).json({success:false,message:"Something went wrong"});
        }
        //Existed
        if(result.length>0)
        {
            //Execute query update command
            connection.query(query,(error,result)=>{
                if(error)
                {
                    console.log(error);
                    return res.status(500).json({success:false,message:"Something Went Wrong"});
                }
                //Handle with reference table
                connection.query(`select * from contract where softwareId = '${id}'`,(error,result)=>{
                    if(error){
                        console.log(error);
                        return;
                    }
                    connection.query(`update contract
                                        set isActive = false
                                        where productId = ${id}`,
                    (error,result)=>{
                        if(error)
                            console.log(error);
                    })
                })
                res.json({success:true,message:"Successfully",id});
            })      
        }
        //Not existed
        else{
            res.status(404).json({success:false,message:"Not Found"});
        }
    })
})
module.exports = router;