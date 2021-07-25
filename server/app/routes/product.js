const connection = require("./connection");
const router = require("express").Router();
const randomString = require("randomstring");

router.get('/',(req, res)=>{
    query = "select * from product";
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
            result = result.filter(product=>
                product.isActive === 1
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
    query = `select * from product where productId='${id}'`;
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
            //Check if product status (1: active,0: softdelete)
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
    const {description,name,complexity,priority} = req.body;
    //generate id
    const id = randomString.generate(10);
    const isActive = true;
    //Validate input data
    //Empty fields
    if(!description || !name || !complexity || !priority || description.length < 1 || name.length < 1)
        return res.status(400).json({success:false,message:"Please Enter All Fields"});
    //Invalid fields
    if( description.length > 200 || name.length > 100 || priority > 10 || complexity > 10|| complexity < 1 || priority < 1)
        return res.status(403).json({success:false,message:"Please Check your data carefully before send"});
    query = `insert into product values ('${id}','${name}','${description}',${complexity},${priority},${isActive})`;
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
    const {description,name,priority,complexity} = req.body;    
    //Validate input data
    //Empty fields
    if(!description || !name || !complexity || !priority)
        return res.status(400).json({success:false,message:"Please Enter All Fields"});
    //Invalid fields

    query = `update product set 
        description='${description}',
        name='${name}',
        complexity=${complexity},
        priority=${priority}
        where productId='${id}'
        `;
    //Check if product has already been existed
    connection.query(`Select * from product where productId='${id}'`,(error,result)=>{
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
    query = `update product set 
        isActive=false
        where productId='${id}'
        `;
    //Check if product has already been existed
    connection.query(`Select * from product where productId='${id}'`,(error,result)=>{
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