import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import EditProfile from "../EditProfile/EditProfile";
import ConfirmModal from "../../modals/ConfirmModal";
import "./index.css";
import PrimaryButton from "../../buttons/PrimaryButton";
import CancelButton from "../../buttons/CancelButton";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchMyUser = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3001/api/user/my-user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched User:", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
    }
  };

  const handleUpdateUser = async (formData) => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3001/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3001/api/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      sessionStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchMyUser();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const proceedDelete = () => {
    setShowDeleteModal(false);
    handleDeleteUser();
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="job-background">
        <div className="title">
          Hi, {user.role === "company" ? user.name : user.firstName}
        </div>
      </div>
      <div className="job-section">
        <div className="job-page">
          {isEditing ? (
            <EditProfile
              user={user}
              onSave={handleUpdateUser}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {user.role === "admin" ? (
                <div className="user-title">
                  <h2>Admin Profile</h2>
                  <p>Admins have special privileges.</p>
                </div>
              ) : user.role === "company" ? (
                <>
                  <div className="user-title">
                    <h2>Company Profile</h2>
                  </div>
                  <div className="profile-card-info">
                    <div className="job-detail">
                      <h4>{user.name}</h4>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Location:</strong> {user.location}
                      </p>
                      <p>
                        <strong>Description:</strong> {user.description}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="user-title">
                    <h2>BASIC INFORMATION</h2>
                  </div>
                  <div className="profile-card-info">
                    <div className="job-detail">
                      <h4>
                        {user.firstName} {user.lastName}
                      </h4>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Location:</strong> {user.location}
                      </p>
                      <p>
                        <strong>Bio:</strong> {user.bio}
                      </p>
                    </div>
                  </div>
                  <div className="user-title">
                    <h2>SKILLS</h2>
                  </div>
                  <div className="profile-cards">
                    {user.skills.map((skill, index) => (
                      <div className="profile-card" key={index}>
                        <div className="job-detail">
                          <h4>{skill}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="button-group">
                <div>
                  <PrimaryButton
                    text="Edit Profile"
                    onClick={() => setIsEditing(true)}
                  />
                </div>
                <div>
                  <CancelButton text="Delete Profile" onClick={confirmDelete} />
                </div>
                <div>
                  <PrimaryButton text="Logout" onClick={handleLogout} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        show={showDeleteModal}
        message="Are you sure you want to delete your profile? This action cannot be undone."
        onConfirm={proceedDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default Profile;