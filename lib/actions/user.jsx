import User from "@lib/models/User";
import { connectToDB } from "@lib/mongodb/mongoose";

export const createOrUpdateUser = async ({
  id,
}) => {
  // first_name,
  // last_name,
  // image_url,
  // email_addresses,
  // username
  // {
  //   $set: {
  //     firstName: first_name,
  //     lastName: last_name,
  //     profilePhoto: image_url,
  //     username: username,
  //   },
  // },
  try {
    await connectToDB();

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      { upsert: true, new: true } // if user doesn't exist, create a new one
    );

    await user.save();
    console.log(user);
  } catch (error) {
    console.error(error);
  }
};

export const deleteUser = async (id) => {
  try {
    await connectToDB();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error(error);
  }
};