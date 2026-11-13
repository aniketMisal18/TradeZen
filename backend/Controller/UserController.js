const { Users } = require("../model/UsersSchema");


const UpdateWatchlist = async (req, res) => {

    if (req.body.job == "ADD") {
        try {
            await Users.findByIdAndUpdate(req.user._id, {$addToSet: { watchlist: req.body.stockId }});
            res.status(204).json({message: "Stock added Successfuly"});
        } catch (error) {
          res.status(400).json({message: error});
        }
    }
    if (req.body.job == "REMOVE") {
         try {
            await Users.findByIdAndUpdate(req.user._id, {$pull: { watchlist: req.body.stockId }});
            res.status(204).json({message: "Stock removed Successfuly"});
        } catch (error) {
          res.status(400).json({message: error});
        }
    }

}


module.exports = {
    UpdateWatchlist,
}