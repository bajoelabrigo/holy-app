import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  updateUser,
  selectUser,
} from "../../redux/fectures/auth/authSlice";
import { toast } from "react-toastify";

const cloud_name = `${import.meta.env.VITE_CLOUD_NAME};`;
const upload_preset = `${import.meta.env.VITE_UPLOAD_PRESET}`;

export const shortenText = (text, n) => {
  if (text.length > n) {
    const shoretenedText = text.substring(0, n).concat("...");
    return shoretenedText;
  }
  return text;
};

const Profile = () => {
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, isSuccess, message, user } = useSelector(
    (state) => state.auth
  );
  const initialState = {
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || "",
    role: user?.role || "",
    isVerified: user?.isVerified || false,
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    let imageURL;
    try {
      if (
        profileImage !== null &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", upload_preset);

        // Save image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/drojpkloa/image/upload",
          { method: "post", body: image }
        );
        const imgData = await response.json();
        console.log(imgData);
        imageURL = imgData.url.toString();
      }

      // Save profile to MongoDB
      const userData = {
        name: profile.name,
        username: profile.username,
        phone: profile.phone,
        bio: profile.bio,
        profilePicture: profileImage ? imageURL : profile.profilePicture,
      };

      dispatch(updateUser(userData));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useLayoutEffect(() => {
    if (user) {
      setProfile({
        ...profile,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
      });
    }
  }, [user]);

  return (
    <>
      <div className="">
        <div className="card card-side bg-base-100  p-8 shadow-xl">
          <div className="space-y-1">
            <figure className="">
              <img
                src={imagePreview === null ? user?.profilePicture : imagePreview}
                alt="Profileimg"
                className="overflow-hidden object-cover rounded-xl size-40
                "
              />
            </figure>
            <input
              type="file"
              accept="image/*"
              name="image"
              className="file-input file-input-primary "
              onChange={handleImageChange}
            />
          </div>
          <div className="card-body">
            <div className="">
              <h3 className="font-bold text-lg my-3"> Update Profile</h3>
              <h3 className="font-bold text-lg my-3">Role: {profile?.role}</h3>
              <form className="flex flex-col gap-4" onSubmit={saveProfile}>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={profile?.name}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="username"
                    placeholder="Name"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={profile?.username}
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={profile?.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={profile?.phone}
                    placeholder="Phone"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    name="phone"
                    onChange={handleInputChange}
                  />
                  <textarea
                    name="bio"
                    value={profile?.bio}
                    placeholder="Bio"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    onChange={handleInputChange}
                    cols={30}
                    rows={10}
                  />
                </div>

                <button className="btn-primary rounded-full btn text-white">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const UserName = () => {
  const user = useSelector(selectUser);

  const username = user?.name || "...";

  return <p className="--color-white">Hi, {shortenText(username, 9)} |</p>;
};

export default Profile;
