import React, { useState } from "react";
import {
  User,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminProfile() {

  // Admin profile data
  const [adminData, setAdminData] = useState(() => {

    const savedAdmin = localStorage.getItem("adminProfile");

    if (savedAdmin) {
      return JSON.parse(savedAdmin);
    }

    return {
      username: "Admin",
      email: "admin@gmail.com",
      password: "admin123"
    };

  });


  // Change password popup
  const [showPasswordPopup, setShowPasswordPopup] =
    useState(false);


  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // Password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });


  // Error message
  const [error, setError] = useState("");


  // Open change password popup
  const openPasswordPopup = () => {

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setError("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setShowPasswordPopup(true);
  };


  // Close popup
  const closePasswordPopup = () => {

    setShowPasswordPopup(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setError("");
  };


  // Handle password input
  const handlePasswordChange = (e) => {

    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };


  // Update password
  const handleUpdatePassword = () => {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = passwordData;


    // Check current password
    if (currentPassword !== adminData.password) {

      setError("Current password is incorrect.");

      return;
    }


    // Check empty fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setError("Please fill in all fields.");

      return;
    }


    // Check new password
    if (newPassword.length < 6) {

      setError(
        "New password must be at least 6 characters."
      );

      return;
    }


    // Check confirmation
    if (newPassword !== confirmPassword) {

      setError(
        "New password and confirm password do not match."
      );

      return;
    }


    // Update admin data
    const updatedAdmin = {
      ...adminData,
      password: newPassword
    };


    setAdminData(updatedAdmin);

    localStorage.setItem(
      "adminProfile",
      JSON.stringify(updatedAdmin)
    );


    // Close popup
    setShowPasswordPopup(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setError("");

    alert("Password updated successfully.");
  };


  return (

    <div className="space-y-8">


      {/* Page Header */}

      <div>

        <h1 className="text-3xl font-bold text-black">
          Admin Profile
        </h1>

      </div>


      {/* Profile Card */}

      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm">


        {/* Profile Header */}

        <div className="mb-8 flex items-center justify-center gap-5">

          {/* Avatar */}

          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-800 bg-white">

            <User
              size={48}
              strokeWidth={1.5}
              className="text-gray-800"
            />

          </div>


          {/* Admin Information */}

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {adminData.username}
            </h2>

            <p className="mt-1 text-sm text-gray-700">
              Administrator
            </p>

          </div>

        </div>


        {/* Profile Details */}

        <div className="mx-auto w-full max-w-md space-y-7">


          {/* Username */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-900">
              User Name
            </label>

            <input
              type="text"
              value={adminData.username}
              disabled
              className="
                h-11
                w-full
                rounded-lg
                border
                border-gray-800
                bg-white
                px-4
                text-sm
                text-gray-900
                outline-none
              "
            />

          </div>


          {/* Email */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-900">
              Email
            </label>

            <input
              type="email"
              value={adminData.email}
              disabled
              className="
                h-11
                w-full
                rounded-lg
                border
                border-gray-800
                bg-white
                px-4
                text-sm
                text-gray-900
                outline-none
              "
            />

          </div>


          {/* Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-900">
              Password
            </label>

            <div className="relative">

              <input
                type="password"
                value="********"
                disabled
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-800
                  bg-white
                  px-4
                  pr-12
                  text-sm
                  text-gray-900
                  outline-none
                "
              />


              {/* Eye Icon */}

              <EyeOff
                size={19}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-800
                "
              />

            </div>

          </div>


          {/* Change Password */}

          <div className="flex justify-end">

            <button
              type="button"
              onClick={openPasswordPopup}
              className="
                rounded-lg
                border
                border-blue-200
                bg-blue-100
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-blue-200
              "
            >
              Change Password
            </button>

          </div>

        </div>

      </div>


      {/* Change Password Popup */}

      {showPasswordPopup && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-7
              shadow-2xl
            "
          >


            {/* Popup Header */}

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-900">
                Change password
              </h2>

            </div>


            {/* Form */}

            <div className="space-y-5">


              {/* Current Password */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Current Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-800
                      bg-white
                      px-4
                      pr-12
                      text-sm
                      text-gray-900
                      outline-none
                      focus:border-blue-600
                      focus:ring-1
                      focus:ring-blue-600
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-800
                      hover:text-blue-700
                    "
                  >

                    {showCurrentPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* New Password */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-900">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-800
                      bg-white
                      px-4
                      pr-12
                      text-sm
                      text-gray-900
                      outline-none
                      focus:border-blue-600
                      focus:ring-1
                      focus:ring-blue-600
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-800
                      hover:text-blue-700
                    "
                  >

                    {showNewPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-800
                      bg-white
                      px-4
                      pr-12
                      text-sm
                      text-gray-900
                      outline-none
                      focus:border-blue-600
                      focus:ring-1
                      focus:ring-blue-600
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-800
                      hover:text-blue-700
                    "
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* Error */}

              {error && (

                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>

              )}

            </div>


            {/* Buttons */}

            <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">


              {/* Cancel */}

              <button
                type="button"
                onClick={closePasswordPopup}
                className="
                  rounded-lg
                  border
                  border-gray-300
                  bg-gray-200
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-300
                "
              >
                Cancel
              </button>


              {/* Update */}

              <button
                type="button"
                onClick={handleUpdatePassword}
                className="
                  rounded-lg
                  bg-blue-700
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-800
                "
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}