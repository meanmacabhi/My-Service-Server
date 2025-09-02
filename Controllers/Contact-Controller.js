const Contact = require("../Models/contact-model");

const contactForm = async (req,res)=>{
    try{
        const response= req.body;
         
        await Contact.create(response);
        
        return res.status(200).json({msg:"Response sent successfully"});

    }
    catch(error){
        
         return res.status(500).json({msg:"Response not delivered"});
    }
}

module.exports = {contactForm};