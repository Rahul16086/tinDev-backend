exports.getMatches = (req, res, next) => {
  res.status(200).json({
    matches: [
      {
        name: "Lucifer",
        age: "30",
        designation: "Senior Software Developer",
        experience: "6 Years",
      },
    ],
  });
};
