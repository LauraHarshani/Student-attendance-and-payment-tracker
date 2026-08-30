import React, { useEffect, useState } from "react";
import {
  User,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminProfile() {

  const [adminData, setAdminData] = useState({
    name: "",
    username: "",
    email: ""
  });

  // LOADING PROFILE

  const [profileLoading, setProfileLoading] = useState(true);


  const [profileError, setProfileError] = useState("");


  // CHANGE PASSWORD POPUP

  const [showPasswordPopup, setShowPasswordPopup] =
    useState(false);


  // PASSWORD VISIBILITY

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // PASSWORD DATA

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });


  // PASSWORD ERROR / SUCCESS

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);


  // GET ADMIN PROFILE FROM MONGODB

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      if (!token) {

        setProfileError(
          "You are not logged in."
        );

        setProfileLoading(false);

        return;
      }


      try {

        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        const data = await response.json();


        if (!response.ok) {

          setProfileError(
            data.message ||
            "Failed to load profile."
          );

          return;
        }


        // Data received from MongoDB
        setAdminData({
          name: data.name || "",
          username: data.username || "",
          email: data.email || ""
        });

      } catch (error) {

        console.error(error);

        setProfileError(
          "Server connection failed. Please try again later."
        );

      } finally {

        setProfileLoading(false);

      }

    };


    fetchProfile();

  }, []);


  // OPEN PASSWORD POPUP

  const openPasswordPopup = () => {

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setError("");

    setSuccess("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setShowPasswordPopup(true);

  };


  // CLOSE PASSWORD POPUP

  const closePasswordPopup = () => {

    if (loading) return;

    setShowPasswordPopup(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setError("");

    setSuccess("");

  };


  // PASSWORD INPUT

  const handlePasswordChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setPasswordData((previous) => ({
      ...previous,
      [name]: value
    }));


    setError("");
    setSuccess("");

  };


  // UPDATE PASSWORD

  const handleUpdatePassword = async () => {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = passwordData;


    setError("");
    setSuccess("");


    // Empty fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setError(
        "Please fill in all fields."
      );

      return;
    }


    // Password length
    if (newPassword.length < 6) {

      setError(
        "New password must be at least 6 characters."
      );

      return;
    }


    // Confirm password
    if (
      newPassword !== confirmPassword
    ) {

      setError(
        "New password and confirm password do not match."
      );

      return;
    }


    // Get JWT
    const token = localStorage.getItem("token");


    if (!token) {

      setError(
        "Your session has expired. Please login again."
      );

      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setError(
          data.message ||
          "Failed to update password."
        );

        return;
      }


      setSuccess(
        "Password updated successfully."
      );


      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });


      setTimeout(() => {

        setShowPasswordPopup(false);
        setSuccess("");

      }, 1200);


    } catch (error) {

      console.error(error);

      setError(
        "Server connection failed. Please try again later."
      );

    } finally {

      setLoading(false);

    }

  };


  // PROFILE LOADING

  if (profileLoading) {

    return (

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-bold text-black">
            Admin Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Loading administrator profile...
          </p>

        </div>


        <div className="
          mx-auto
          w-full
          max-w-3xl
          rounded-2xl
          bg-white
          p-8
          shadow-sm
        ">

          <div className="flex justify-center py-10">

            <p className="text-sm text-gray-500">
              Loading profile...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // PROFILE ERROR

  if (profileError) {

    return (

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-bold text-black">
            Admin Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your administrator account.
          </p>

        </div>


        <div className="
          mx-auto
          w-full
          max-w-3xl
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
        ">

          <p className="
            text-sm
            font-medium
            text-red-600
          ">

            {profileError}

          </p>

        </div>

      </div>

    );

  }


  // PAGE

  return (

    <div className="space-y-8">


      {/* PAGE HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-black">
          Admin Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your administrator account.
        </p>

      </div>


      {/* PROFILE CARD */}

      <div className="
        mx-auto
        w-full
        max-w-3xl
        rounded-2xl
        bg-white
        p-8
        shadow-sm
      ">


        {/* Profile Header */}

        <div className="
          mb-8
          flex
          items-center
          justify-center
          gap-5
        ">


          {/* Avatar */}

          <div className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border
            border-gray-800
            bg-white
          ">

            <User
              size={48}
              strokeWidth={1.5}
              className="text-gray-800"
            />

          </div>


          {/* Admin Information */}

          <div>

            <h2 className="
              text-xl
              font-bold
              text-gray-900
            ">

              {adminData.username || "Admin"}

            </h2>


            <p className="
              mt-1
              text-sm
              text-gray-700
            ">

              Administrator

            </p>

          </div>

        </div>


        {/* PROFILE DETAILS */}

        <div className="
          mx-auto
          w-full
          max-w-md
          space-y-7
        ">


          {/* Username */}

          <div>

            <label className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-900
            ">

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
                bg-gray-50
                px-4
                text-sm
                text-gray-900
                outline-none
              "
            />

          </div>


          {/* Email */}

          <div>

            <label className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-900
            ">

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
                bg-gray-50
                px-4
                text-sm
                text-gray-900
                outline-none
              "
            />

          </div>


          {/* Password */}

          <div>

            <label className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-900
            ">

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
                  bg-gray-50
                  px-4
                  pr-12
                  text-sm
                  text-gray-900
                  outline-none
                "
              />


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


      {/* CHANGE PASSWORD POPUP */}

      {showPasswordPopup && (

        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/40
          px-4
        ">


          <div className="
            w-full
            max-w-md
            rounded-2xl
            bg-white
            p-7
            shadow-2xl
          ">


            {/* Popup Header */}

            <div className="mb-6">

              <h2 className="
                text-xl
                font-bold
                text-gray-900
              ">

                Change Password

              </h2>


              <p className="
                mt-1
                text-sm
                text-gray-500
              ">

                Update your administrator account password.

              </p>

            </div>


            {/* Form */}

            <div className="space-y-5">


              {/* Current Password */}

              <div>

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-900
                ">

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
                    value={
                      passwordData.currentPassword
                    }
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

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-900
                ">

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
                    value={
                      passwordData.newPassword
                    }
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

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-900
                ">

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
                    value={
                      passwordData.confirmPassword
                    }
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

                <div className="
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-red-600
                  ">

                    {error}

                  </p>

                </div>

              )}


              {/* Success */}

              {success && (

                <div className="
                  rounded-lg
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-green-700
                  ">

                    {success}

                  </p>

                </div>

              )}

            </div>


            {/* Buttons */}

            <div className="
              mt-7
              flex
              justify-end
              gap-3
              border-t
              border-gray-200
              pt-5
            ">


              {/* Cancel */}

              <button
                type="button"
                onClick={closePasswordPopup}
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                Cancel

              </button>


              {/* Update */}

              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {loading
                  ? "Updating..."
                  : "Update"
                }

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}