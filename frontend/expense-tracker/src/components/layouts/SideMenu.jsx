import React, { useContext, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAavar from "../Cards/CharAavar";
import Modal from "../Modal";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import Input from "../Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-hot-toast";

const SideMenu = ({ activeMenu, onClose }) => {
  const { user, clearUser, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    profileImage: null,
  });

  // Handle menu click
  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
    // Close mobile menu when clicking a menu item
    if (onClose) onClose();
  };

  // Logout function
  const handleLogout = () => {
  localStorage.removeItem("token");
  clearUser();
  navigate("/login", { replace: true });
};

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      let profileImageUrl = user?.profileImageUrl;

      // Upload new profile image if selected
      if (profileData.profileImage) {
        const imgUploadRes = await uploadImage(profileData.profileImage);
        profileImageUrl = imgUploadRes.imageUrl || profileImageUrl;
      }

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        fullName: profileData.fullName,
        profileImageUrl,
      });

      if (response.data) {
        updateUser(response.data);
        setOpenProfileModal(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
   <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 z-20">
      
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 bg-slate-200 rounded-full object-cover"
          />
        ) : (
          <CharAavar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}

        <h5 className="text-gray-800 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>

      {/* Menu Items */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px]
          ${
            activeMenu === item.label
              ? "text-white bg-primary"
              : "text-gray-700 hover:bg-gray-100"
          }
          py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      {/* Profile Settings Button */}
      <button
        className="w-full flex items-center gap-4 text-[15px] text-gray-700 hover:bg-gray-100 py-3 px-6 rounded-lg mt-4"
        onClick={() => {
          setProfileData({
            fullName: user?.fullName || "",
            profileImage: null,
          });
          setOpenProfileModal(true);
        }}
      >
        <span className="text-xl">⚙️</span>
        Profile Settings
      </button>

      {/* Profile Edit Modal */}
      <Modal
        isOpen={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <ProfilePhotoSelector
            image={profileData.profileImage}
            setImage={(img) => setProfileData({ ...profileData, profileImage: img })}
          />
          <Input
            value={profileData.fullName}
            onChange={({ target }) => setProfileData({ ...profileData, fullName: target.value })}
            label="Full Name"
            placeholder="Enter your name"
            type="text"
          />
          <div className="flex justify-end mt-6">
            <button
              className="add-btn add-btn-fill"
              onClick={handleProfileUpdate}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SideMenu;