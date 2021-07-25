const connection = require("./connection");

router.get('/',(req, res)=>{
    query = "select * from product";
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
    query = `select * from product where id='${id}'`;
    connection.query(query,(error,result)=>
    {
        if(error)
        {
            console.log(error);
            res.status(400).json({success:false,message:"Something went wrong"});
            return;
        }
        if(result.length>0)
        {
            res.json({success:true,message:"Successfully",data:result});
        }
        else
        {
            res.status(404).json({success:false,message:"Not Found"});
        }
    })
})

router.post('/',(req,res)=>{
    const {desc,name,priority,complexity} = req.body;
    const id = randomString.generate(10);
    query = `insert into product values ('${id}','${name}','${desc}',${priority},${complexity})`;
    connection.query(query,(error,result)=>{
        if(error)
        {
            res.status(400).json({success:false,message:"Something went wrong"});
        }
        if(result)
        {
            res.json({success:true,message:"Successfully"});
        }
    })
})

router.patch('/:id',(req,res)=>{
    const id = req.params.id;
    const {desc,name,priority,complexity} = req.body;
    query = `update product set 
        description='${desc}',
        name='${name}',
        priority=${priority},
        complexity=${complexity}
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
    query = `delete from product where id = '${id}'`
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