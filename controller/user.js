const registerUser = async (req, res) => {
  try {
    const { name, password, email, mobile } = req.body;

    if (!name || !password || !email || !mobile) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { registerUser };
