import React, { useState, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import Modal from "../Modal";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import Input from "../Inputs/Input";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-hot-toast";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    profileImage: null,
  });
  const { user, updateUser } = React.useContext(UserContext);

  // Close side menu when profile modal opens on mobile
  useEffect(() => {
    if (openProfileModal && window.innerWidth < 1024) {
      setOpenSideMenu(false);
    }
  }, [openProfileModal]);

  const handleProfileUpdate = async () => {
    try {
      let profileImageUrl = user?.profileImageUrl;

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
        setOpenSideMenu(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const openProfileSettings = () => {
    setProfileData({
      fullName: user?.fullName || "",
      profileImage: null,
    });
    setOpenProfileModal(true);
  };

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">Expense Tracker</h2>

      {/* Mobile Sidebar Overlay */}
      {openSideMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setOpenSideMenu(false)}
          />
          {/* Side Menu */}
          <div className="fixed lg:hidden left-0 top-[61px] z-40">
            <SideMenu 
              activeMenu={activeMenu} 
              onClose={() => setOpenSideMenu(false)}
              onProfileSettings={openProfileSettings}
            />
          </div>
        </>
      )}

      {/* Profile Modal - Rendered at Navbar level for mobile */}
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

export default Navbar;
