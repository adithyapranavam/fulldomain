var Userdb = require('../model/model');

//create and save new user
exports.create = (req, res) => {
  //validate request
  if (!req.body) {
    res.status(400).send({ message: "contant can not be empty!" });
    return;
  }
  //new user
  const user = new Userdb({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    status: req.body.status,
    isAdmin: false,
  });
  //save user in the database
  user
    .save(user)
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "some error occurred while creating a create operation",
      });
    });
};

//retrieve and return all users/retrive and return a single user
exports.find = (req,res)=>
{
    if(req.query.id)
    {
        const id = req.query.id;
        Userdb.findById(id)
        .then(data=>
            {
                if(!data)
                {
                    res.status(404).send({message : "not found user with id"+id})
                }
                else{
                    res.send(data)
                }
            })
            .catch(err=>
                {
                    res.status(500).send({message:"error retrieving user with id"+id})
                })

    }else{
        console.log("find")
        
        Userdb.find()
        .then(user=>
            {
                res.send(user)
            }) 
            .catch(err=>
                {
                    res.status(500).send({message:err.message||"Error Occured while retriving user information"})
                })
    }
  
}

//update a new identifier user by user id
exports.update = (req,res)=>
{
    if(!req.body)
    {
     return res
     .status(400)
     .send({message :"Data to update can not be empty"})
    }
    const id = req.params.id;
    Userdb.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
    .then(data=>
     {
         if(!data)
         {
             res.status(404).send({message:`cannot Update user with ${id}. Maybe user not found!`})
         }else{
             res.send(data)
         }
     })
     .catch(err=>
         {
             res.status(500).send({message:"Error Update user information"})
         })
}
//delete a user with specified user id in the request
exports.delete = (req,res)=>
{
    console.log("welcome to delete user")
    const id =req.query.id;
    console.log(id)

    Userdb.findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:`Cannot Delete with id $(id).Maybe id is worng`})
            }else{
                // res.send({
                //     message:`User was deleted successfully!`
                // })
                res.redirect("/user_details")
            }
        })
        .catch(err=>{
            res.status(500).send({
                message:"Could not delete User with id="+id
            });
        });
}