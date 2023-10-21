const axios = require("axios");
const Userdb = require("../model/model");
const Admin = require("../model/adminModel");

exports.homeRoutes = (req, res) => {
  if(req.session.userId){
    res.redirect('/dashboard_user')
  }else{
    res.render("user_login");
  }
};

exports.user_login = async (req, res) => {
   
    try {
      const {email,password}=req.body;
      if(!email||!password){
        res.render("user_login",{message:"Require all the feilds"})
      }
      const isExistingUser = await Userdb.findOne({ email: email ,isAdmin:false });

      if(!isExistingUser){
        return res.render("user_login",{message:"This user not found"});
      }
      if(isExistingUser.password==password){
        req.session.userId = email;
        res.redirect("/dashboard_user")
      }else {
        res.render("user_login",{message:"Wrong password or Email"});
      }
    } catch (error) {
      res.send("wrong details", error.message);
    }
  }
exports.user_details = (req, res) => {
  if (req.session.adminId) {
    axios
      .get("http://localhost:3000/api/users")
      .then(function (response) {
        res.render("index", { users: response.data });
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.redirect("/admin_login");
  }
};

exports.admin_login = (req, res) => {
  if (req.session.adminId) {
    res.redirect("/user_details");
  } else {
    res.render("admin_login");
  }
};

exports.dashboard_user = (req, res) => {
  if (req.session.userId) {
    res.render("dashboard_user");
  } else {
    res.redirect("/login");
  }
};

exports.signUser = (req, res) => {
  console.log("sign in");
  res.render("signup");
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.render("user_login",{message:"User logout successfully"});
    }
  });
};

exports.add_user = (req, res) => {
  res.render("add_user");
};

exports.update_user = (req, res) => {
  axios
    .get("http://localhost:3000/api/users", { params: { id: req.query.id } })
    .then(function (userdata) {
      res.render("update_user", { user: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

// ............................ADMIN....................................


//Get dashboard

exports.verify_admin_login = async(req, res) => {
try{
  console.log("comming to admin post method");
  const {email,password}=req.body;
  console.log(req.body);
  if(!email||!password){
    return res.render("admin_login",{message:"Please fill all the feilds"})
  }
  const isExistingAdmin=await Userdb.findOne({email:email,isAdmin:true});
 
  if(!isExistingAdmin){
   return res.render("admin_login",{message:"Admin not found"})
  }
  if(isExistingAdmin.password==password){
    req.session.adminId=email;
    return res.redirect("/user_details")
  }else{
   return res.render("admin_login",{message:"Invalid password"})
  }

}catch(error){
  return res.send("Internal server error"+error.message)
}
};

exports.dashboard_admin = (req, res) => {
  req.render("index");
};

exports.adding_user = (req, res) => {
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
    IsAdmin: false,
    
  });
  //save user in the database
  user
    .save(user)
    .then((data) => {
      res.redirect("/user_details");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "some error occurred while creating a create operation",
      });
    });
};

exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.render("admin_login",{message:"Admin logout successfully"});
      
    }
  });
};
