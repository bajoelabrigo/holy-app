import User from "../models/userModel.js";


export const findUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user)  return res.status(400).json({message:"Fill all fields"})
};

export const searchUsers = async (keyword, userId) => {
  const users = await User.find({
    //name: { $regex: keyword, $options: "i" } Si quiero buscar un solo valor
    $or: [
      //Si quiero buscar varios valores
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ],
  }).find({
    _id: { $ne: userId },
  });
  return users;
};
