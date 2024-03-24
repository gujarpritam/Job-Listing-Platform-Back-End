const Job = require("../models/job");

const createJobPost = async (req, res) => {
  try {
    const {
      companyName,
      title,
      description,
      logoUrl,
      salary,
      location,
      duration,
      locationType,
      skills,
    } = req.body;

    if (
      !companyName ||
      !title ||
      !description ||
      !logoUrl ||
      !salary ||
      !location ||
      !duration ||
      !locationType ||
      !skills
    ) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const jobDetails = new Job({
      companyName,
      title,
      description,
      logoUrl,
      salary,
      location,
      duration,
      locationType,
      skills,
    });

    await jobDetails.save();

    res.json({ message: "Job created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { createJobPost };
