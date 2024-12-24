const { user } = require("./user.mode");
const repository = require("./user.repository");
const bcrypt = require("bcrypt")
const getAllUser = async (req,res,next)=>{
    try{
        const Users = await repository.findAllUsers()
        res.status(200).send(Users);
    }catch(error){
      console.log(error);
     return res.status(500).send(error);
    }
};

const getUserById = async(req,res)=> {
    const id = req.params.id
    try{
const User = await repository.findUserById(id);
     if(User.isDelete === true){
         res.status(404).send("Data Not Found");
        }else{
         res.status(200).send(User);
     }
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
};

const createUser = async(req,res)=>{
    try{
   const checkCodeIsExists = await repository.isEmailIsExist(req.body.email);
   if (checkCodeIsExists)
     return res.status(400).send(`the email  is already exists`);

const password =req.body.password;
const hashing = await bcrypt.hash(password,12)

  const newUser = new user({
   
    name : req.body.name,
    gender : req.body.gender,
    email : req.body.email,
    password : hashing,
    phone : req.body.phone,

  });
   const saveUser = await repository.createUser(newUser);
   console.log(saveUser);
   if (saveUser) {
    console.log("User saved successfully");
    return res.status(201).send(saveUser);
  } else {
    console.log("User not saved");
    return res.status(400).send("Error saving User");
  }
}catch(error){
      console.log(error);
      return  res.status(500).send(error);
    }
};

const updateUser = async(req,res) =>{
    const id = req.params.id;
    try{
        const User = await repository.findUserById(id);
        
        if(User.isDelete=== false){
            const updateUser ={
    name : req.body.name,
    gender : req.body.gender,
    phone : req.body.phone,
                
            }
            await repository.update(id, updateUser);
            const User = await repository.findUserById(id);
           
          return res.status(200).send(User);

        }
        res.status(404).send("Data Not found");

    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
};

const deleteUser = async(req,res) =>{
    const id = req.params.id;
    try{
        const User = await repository.findUserById(id);
        if(User){
        await repository.removeUser(id);
        return res.status(200).send("DELETED");
    }
    }catch(error){
      console.log(error);
      return   res.status(500).send(error);
    }
};


module.exports = {getAllUser,getUserById,createUser,updateUser,deleteUser}