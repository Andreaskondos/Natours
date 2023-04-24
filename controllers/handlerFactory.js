const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (SchemaModel) =>
  catchAsync(async (req, res, next) => {
    const doc = await SchemaModel.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError("No document not found with that ID", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (SchemaModel) =>
  catchAsync(async (req, res, next) => {
    const doc = await SchemaModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (SchemaModel) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await SchemaModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc: newDoc,
      },
    });
  });

exports.getOne = (SchemaModel, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = SchemaModel.findById(req.params.id);

    if (popOptions)
      query = SchemaModel.findById(req.params.id).populate(popOptions);
    const doc = await query;
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (SchemaModel) =>
  catchAsync(async (req, res, next) => {
    //To work with nested route for Tour to Review
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(SchemaModel.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .page();
    // const docs = await features.query.explain();
    const docs = await features.query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        docs,
      },
    });
  });
