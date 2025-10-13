const Career = require('../models/Career');

exports.getCareers = async (req, res, next) => {
    try {
        const list = await Career.find({}).lean();
        res.json({ status: 'success', data: list });
    } catch (err) { next(err); }
};

exports.getCareerById = async (req, res, next) => {
    try {
        const career = await Career.findById(req.params.id).lean();
        if (!career) return res.status(404).json({ status: 'fail', message: 'Career not found' });
        res.json({ status: 'success', data: career });
    } catch (err) { next(err); }
};
