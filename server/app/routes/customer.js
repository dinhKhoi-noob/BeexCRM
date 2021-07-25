const connection = require("./connection");

router.get('/',(req, res)=>{
    query = "select * from customer";
    connection.query(query,(error,result)=>{
        if (error)
        {
            console.log(error);
            res.status(404).json({success: false,message:"Not found"});
        }
        if(result)
        {
            res.json({success:true,data:result,message:"Successfully"});
        }
    })
})

router.get('/:id',(req, res)=>{
    const id = req.params.id;
    query = `select * from customer where id='${id}'`;
    connection.query(query,(error,result)=>
    {
        if(error)
        {
            console.log(error);
            res.status(500).json({success:false,message:"Something went wrong",error});
        }
        if(result)
        {
            if(result.length>0)
            {
                res.json({success:true,message:"Successfully",data:result});
            }
            else
            {
                res.status(404).json({success:false,message:"Not Found"});
            }
        }
    })
})

router.post('/',(req,res)=>{
    const {address,name,phone,email} = req.body;
    const id = randomString.generate(10);
    query = `insert into customer values ('${id}','${name}','${address}','${email}','${phone}')`;
    connection.query(query,(error,result)=>{
        if(error)
        {
            res.status(400).json({success:false,message:"Something went wrong"});
        }
        if(result)
        {
            res.json({success:true,message:"Successfully",data:result});
        }
    })
})

router.patch('/:id',(req,res)=>{
    const id = req.params.id;
    const {address,name,phone,email} = req.body;    
    query = `update customer set 
        address='${address}',
        name='${name}',
        phone='${phone}',
        email='${email}'
        where id='${id}'
        `;
    connection.query(query,(error,result)=>{
        if(error)
        {
            console.log(error);
            res.status(400).json({success:false,message:"Something Went Wrong"});
        }
        if(result)
        {
            res.json({success:true,message:"Successfully"});
        }
    })
})

router.delete("/:id",(req,res)=>{
    const id = req.params.id;
    query = `delete from customer where id = '${id}'`
    connection.query(query,(error,result)=>{
        if(error)
        {
            console.log(error);
            res.status(400).json({success:false,message:"Something Went Wrong"});
        }
        if(result)
        {
            res.json({success:true,message:"Successfully"});
        }
    })
})

module.exports = router;