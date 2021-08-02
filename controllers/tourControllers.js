const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  req.tour = tour;
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID!",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price!",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getTour = (req, res) => {
  const tour = req.tour;
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  const tour = req.tour;

  const updateObjKeys = Object.keys(req.body);
  updateObjKeys.forEach((key) => {
    tour[key] = req.body[key];
  });

  const index = tours.indexOf(tour);
  if (index > -1) {
    tours.splice(index, 1);
    tours.push(tour);
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.deleteTour = (req, res) => {
  const tour = req.tour;

  const index = tours.indexOf(tour);
  if (index > -1) {
    tours.splice(index, 1);
  }

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
      });
    }
  );
};
