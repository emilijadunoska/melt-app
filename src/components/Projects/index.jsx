import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./index.css";
import ProjectData from "./../../Assets/projects.json";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import ProjectFilter from "../ProjectFilter";

const Projects = () => {
  const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
  const [filteredProjects, setFilteredProjects] = useState([
    ...savedProjects,
    ...ProjectData,
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState(false);

  function saveProject(
    id,
    projectTitle,
    projectDescription,
    projectStatus,
    uploadDate,
    userId,
    __v
  ) {
    const projectData = {
      id,
      projectTitle,
      projectDescription,
      projectStatus,
      uploadDate,
      userId,
      __v,
    };

    window.localStorage.setItem("SavedProject", JSON.stringify(projectData));
    console.log(projectData);
  }

  const searchEvent = (event) => {
    const data = event.target.value;
    setSearchTerm(data);
    if (searchTerm !== "" || searchTerm.length > 2) {
      const filterData = ProjectData.filter((project) => {
        if (project) {
          return Object.values(project)
            .join("")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        } else {
          return 0;
        }
      });
      setFilteredProjects(filterData);
    } else {
      setFilteredProjects(ProjectData);
    }
  };

  function handleStatusFilter(selectedStatus) {
    if (selectedStatus.length === 0 || selectedStatus.includes("All")) {
      setFilteredProjects(ProjectData);
      return;
    }
    const filtered = ProjectData.filter((project) =>
      selectedStatus.includes(project.projectStatus)
    );
    setFilteredProjects(filtered);
  }

  return (
    <>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Discover Projects</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {filteredProjects.map(
              ({
                id,
                projectTitle,
                projectDescription,
                projectStatus,
                uploadDate,
                userId,
                __v,
              }) => {
                return (
                  <div className="job-list" key={id}>
                    <div className="job-card">
                      <div className="job-name">
                        <div className="job-detail">
                          <h4>{projectTitle}</h4>
                          <p>{projectDescription}</p>
                          <div className="category">
                            <p>Status: {projectStatus}</p>
                            <p>Uploaded: {uploadDate}</p>
                            <p>User ID: {userId}</p>
                          </div>
                        </div>
                      </div>
                      <div className="job-button">
                        <div className="job-posting">
                          <Link to="/send-inquiry">View project</Link>
                        </div>
                        <div className="save-button">
                          <Link
                            to="/Projects"
                            onClick={() => {
                              saveProject(
                                {
                                  id,
                                  projectTitle,
                                  projectDescription,
                                  projectStatus,
                                  uploadDate,
                                  userId,
                                  __v,
                                },
                                setActive(!active)
                              );
                            }}
                          >
                            {JSON.parse(localStorage.getItem("Job"))?.id ===
                            id ? (
                              <AiFillHeart />
                            ) : (
                              <AiOutlineHeart />
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <ProjectFilter
            handleStatusFilter={handleStatusFilter}
            searchEvent={searchEvent}
          />
        </div>
      </div>
    </>
  );
};

export default Projects;
