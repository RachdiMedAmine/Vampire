const AppError = require('./../utils/app-Errors');
const catchAsync = require('./../utils/catchAsync');
const APIfeatures = require('./../utils/API-Features');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByIdAndDelete(req.params.id);
    if (!model) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'successfully deleted'
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!model) {
      return next(new AppError('Document not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        model
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const model = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: model
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('doc not found', 404));
    }
    res.status(201).json({
      status: 'sucess',
      data: {
        doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const API = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const docs = await API.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
