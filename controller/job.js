const Job = require("../models/job");
const { decodeJwtToken } = require("../middlewares/verifyToken");
const { ObjectId } = require("mongoose");

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
      about,
      information,
      jobType,
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
      !about ||
      !information ||
      !jobType ||
      !skills
    ) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const userId = req.userId;

    const jobDetails = new Job({
      companyName,
      title,
      description,
      logoUrl,
      salary,
      location,
      duration,
      locationType,
      about,
      information,
      jobType,
      skills,
      refUserId: userId,
    });

    await jobDetails.save();

    res.json({ message: "Job created successfully" });
  } catch (error) {
    next(error);
  }
};

const getJobDetailsById = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = decodeJwtToken(req.headers["authorization"]);

    const jobDetails = await Job.findById(jobId);

    if (!jobDetails) {
      return res.status(400).json({
        message: "Bad request",
      });
    }

    let isEditable;
    if (userId) {
      let formattedUserId = new ObjectId(userId);

      // console.log("userId", userId);
      // console.log("formattedUserId", formattedUserId);

      if (jobDetails.refUserId.equals(formattedUserId.path)) {
        isEditable = true;
      }
    }

    // console.log("isEditable", isEditable);

    res.json({ jobDetails, isEditable: isEditable });
  } catch (error) {
    next(error);
  }
};

const updateJobDetailsById = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.userId;

    if (!jobId) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const isJobExists = await Job.findOne({ _id: jobId, refUserId: userId });

    if (!isJobExists) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

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
      information,
      jobType,
      about,
      refUserId,
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
      !skills ||
      !information ||
      !jobType ||
      !about
    ) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    await Job.updateOne(
      { _id: jobId, refUserId: userId },
      {
        $set: {
          companyName,
          title,
          description,
          logoUrl,
          salary,
          location,
          duration,
          locationType,
          skills,
          information,
          jobType,
          about,
        },
      }
    );

    res.json({ message: "Job updated successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const title = req.query.title || "";
    const skills = req.query.skills;
    let filteredSkills;
    let filter = {};

    if (skills) {
      filteredSkills = skills.split(",");
      filter = { skills: { $in: filteredSkills } };
    }

    //added filter based on title
    const jobList = await Job.find(
      {
        title: { $regex: title, $options: "i" },
        ...filter,
      }
      // { companyName: 1, title: 1 }
    );

    res.json({ data: jobList });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobPost,
  getJobDetailsById,
  updateJobDetailsById,
  getAllJobs,
};
