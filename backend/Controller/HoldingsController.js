const { Holdings } = require("../model/HoldingsSchema");


 const AddHolding = async(req,res) =>{
  
    try {
        if(req.body.holding){
            let newHolding = new Holdings(req.body.holding);
             await newHolding.save();
            res.status(201).json({ message: "BUY successful ", success: true });
        }else{
             res.status(403).json({ message: "Holding Not Found " });
        }
        
    } catch (error) {
        res.status(403).json({ message: "Something is wrong " , error});
    }

}


const GetHolding = async(req,res) =>{

    try {
        let allHoldings = await Holdings.find({user : req.user._id});
        
        
        res.json(allHoldings);
    } catch (error) {
        res.json({message: error})
    }
}



module.exports = {
    AddHolding,
    GetHolding
}
