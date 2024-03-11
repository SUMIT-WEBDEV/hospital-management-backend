const Healthplan = require('../models/Healthplan');

module.exports.create = async (req, res) => {
    try {
        const newPlan = new Healthplan({
            name: req.body.name,
            duration: req.body.duration,
            price: req.body.price,
            doctorFollowup: req.body.doctorFollowup,
            seniorDietecianFollowup: req.body.seniorDietecianFollowup,
            dietecianFollowup: req.body.dietecianFollowup,
        })

        await newPlan.save();

        res.status(200).json({
            success: true,
            message: "Health plan created successfully",
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
};

module.exports.getAll = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Health plans fetched successfully",
            data: await Healthplan.find()
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
};