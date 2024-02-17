const User = require("../model/user");
const lib = require("../lib/user");

const HandleUserSignup = async (req, res) => {
  const result = lib.validateUserSignup(req.body);

  if (result.error) {
    return res.status(400).json({ status: "error", error: result.error });
  }

  const { firstname, lastname, email, password } = result.data;

  try {
    const { hash: hashpassword, salt } = lib.generatehash(password);

    const createUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashpassword,
      salt,
    });

    const token = lib.generateUserToken({
      _id: createUser._id.toString(),
      role: createUser.role,
    });

    return res.json({
      status: "success",
      data: { _id: createUser._id, token: token },
    });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(400)
        .json({ message: `user with email ${email} already exists!` });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const HandleUserSignin = async (req, res) => {
  const result = lib.validateUserSignin(req.body);

  if (result.error) {
    return res.status(400).json({ status: "error", error: result.error });
  }

  const { email, password } = result.data;

  const userInDB = await User.findOne({ email });

  if (!userInDB)
    return res
      .status(404)
      .json({ error: `user with email ${email} does not exist!` });

  const salt = userInDB.salt;
  const hashedPasswordDB = userInDB.password;

  const { hash } = lib.generatehash(password, salt);

  if (hash !== hashedPasswordDB)
    return res.status(400).json({ error: `Incorrect password` });

  const token = lib.generateUserToken({
    _id: userInDB._id.toString(),
    role: userInDB.role,
  });

  return res.json({ status: "success", data: { token: token } });
};

module.exports = { HandleUserSignup, HandleUserSignin };
