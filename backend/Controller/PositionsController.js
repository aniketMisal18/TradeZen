const { Positions } = require("../model/PositionsSchema");


 const AddPosition = async(req,res) =>{
  
    try {
        if(req.body.position){
            let newPosition = new Positions(req.body.position);
             await newPosition.save();
            res.status(201).json({ message: "Position taken ", success: true });
        }else{
             res.status(403).json({ message: "Positions Not Found " });
        }
        
    } catch (error) {
        res.status(403).json({ message: "Something is wrong " , error});
    }

}


const GetPosition = async(req,res) =>{

    try {
        let allPosition = await Positions.find({user : req.user._id});
        res.json(allPosition);
    } catch (error) {
        res.json({message: error})
    }
}

module.exports = {
    AddPosition,
    GetPosition
}
