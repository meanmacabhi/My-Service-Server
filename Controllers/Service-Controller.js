const Service = require("../Models/service-model");

const services =async(req,res)=>{
    try {
        const response = await Service.find();
        if(!response){
            res.status(404).json({msg:"no services found"});
            return;
        }
        //console.log("Service data found:", response);
        res.status(200).json({msg:response})
    } catch (error) {
        console.log("services",error);
    }
}
module.exports = {services};