const User = require("../Models/user-model");
const Contact = require("../Models/contact-model");
const sendEmail = require("../Utils/SendEmail"); 


const getAllUsers=async(req,res)=>{
    try {
        const users = await User.find({},{password:0});
       

        if(!users || users.length==0){
            return res.status(404).json({msg:"no users found"})
        }
         res.status(200).json(users);
    } catch (error) {
        console.log("admin-users error",error);
        res.status(500).json({ msg: "Server error while fetching users" }); 
    }
}

const getAllContacts = async(req,res)=>{
    try {
        const contacts = await Contact.find();
        if(!contacts || contacts.length==0){
            return res.status(404).json({msg:"no contacts found"});
        }

        res.status(200).json(contacts);
    } catch (error) {
        console.log("admin-contacts error",error);
        res.status(500).json({ msg: "Server error while fetching contacts" }); 
    }
}

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await User.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUserById error:", error);
    res.status(500).json({ msg: "Server error while deleting user" });
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Contact.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUserById error:", error);
    res.status(500).json({ msg: "Server error while deleting user" });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await User.findOne({ _id: id },{password:0});

    return res.status(200).json(data);

    

    
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ msg: "Server error while getting user" });
  }
};

const updateUserById=async(req,res)=>{
  try {
    const id = req.params.id;
    const updateUserData = req.body;

    const updatedData = await User.updateOne({_id:id},{$set:updateUserData});

    return res.status(200).json(updatedData);

  } catch (error) {
    console.error("updateUserById error:", error);
    res.status(500).json({ msg: "Server error while updating user user" });
  }
}

const sendResponseToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    const subject = "Response from Admin";
    const html =
      response ||
      `<p>Hello ${contact.username},</p>
       <p>We have received your message: "${contact.message}". Our team will look into it.</p>
       <p>Thanks,<br/>Admin</p>`;

    // ✅ use sendEmail.js
    await sendEmail(contact.email, subject, html);

    res.status(200).json({ msg: "Response email sent successfully" });
  } catch (error) {
    console.error("sendResponseToContact error:", error);
    res.status(500).json({ msg: "Server error while sending email" });
  }
};


module.exports = {getAllUsers,getAllContacts,deleteUserById,deleteContactById,getUserById,updateUserById,sendResponseToContact};