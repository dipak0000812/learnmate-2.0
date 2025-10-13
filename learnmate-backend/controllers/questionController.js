const { validationResult } = require('express-validator');
const Question = require('../models/Question');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const question = await Question.create(req.body);
    res.status(201).json({ status: 'success', data: question });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { career, semester } = req.query;
    const filter = {};
    if (career) filter.career = career;
    if (semester) filter.semester = Number(semester);
    const questions = await Question.find(filter).limit(50);
    res.json({ status: 'success', data: questions });
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.json({ status: 'success', data: question });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.json({ status: 'success', data: question });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.json({ status: 'success', data: { message: 'Deleted' } });
  } catch (err) { next(err); }
};


