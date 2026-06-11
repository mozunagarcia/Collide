// TODO: AdminDashboard component
import { useEffect, useState } from "react";
import api from "../../utils/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState("");
  const [courseForm, setCourseForm] = useState({
    department: "",
    number: "",
    name: "",
    section: "",
    instructor: "",
    quarter: ""
  });

  async function loadAdminData() {
    try {
      const usersRes = await api.get("/admin/users");
      const coursesRes = await api.get("/admin/courses");
      const analyticsRes = await api.get("/admin/analytics");

      setUsers(usersRes.data);
      setCourses(coursesRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setMessage("Could not load admin data.");
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  function handleCourseChange(e) {
    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value
    });
  }

  async function handleCreateCourse(e) {
    e.preventDefault();

    if (!courseForm.department.trim()) {
      setMessage("Department is required.");
      return;
    } else if (!courseForm.number.trim()) {
      setMessage("Course number is required.");
      return;
    } else if (!courseForm.name.trim()) {
      setMessage("Course name is required.");
      return;
    } else if (!courseForm.quarter.trim()) {
      setMessage("Quarter is required.");
      return;
    }

    try {
      await api.post("/admin/courses", {
        department: courseForm.department,
        number: courseForm.number,
        name: courseForm.name,
        section: courseForm.section,
        instructor: courseForm.instructor,
        quarter: courseForm.quarter
      });

      setCourseForm({
        department: "",
        number: "",
        name: "",
        section: "",
        instructor: "",
        quarter: ""
      });

      setMessage("Course created successfully.");
      loadAdminData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create course.");
    }
  }

  async function handleDeleteCourse(courseId) {
    const confirmed = window.confirm("Are you sure you want to delete this course?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/courses/${courseId}`);
      setMessage("Course deleted successfully.");
      loadAdminData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete course.");
    }
  }

  let totalUsers = users.length;
  let matchedUsers = 0;
  let matchRate = 0;
  let totalGroups = 0;
  let averageGroupSize = 0;
  let groupSizeDistribution = [];
  let majorBreakdown = [];

  if (analytics) {
    if (analytics.matchRate) {
      totalUsers = analytics.matchRate.totalUsers;
      matchedUsers = analytics.matchRate.matchedUsers;
      matchRate = analytics.matchRate.percentage;
    }

    if (analytics.groupSize) {
      totalGroups = analytics.groupSize.totalGroups;
      averageGroupSize = analytics.groupSize.averageSize;
      groupSizeDistribution = analytics.groupSize.distribution || [];
    }

    if (analytics.majorBreakdown) {
      majorBreakdown = analytics.majorBreakdown;
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>View users, create courses, delete courses, and check analytics.</p>
        </div>
      </div>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}

      <div className="admin-stats">
        <div className="admin-stat-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>

        <div className="admin-stat-card">
          <h3>Matched Users</h3>
          <p>{matchedUsers}</p>
        </div>

        <div className="admin-stat-card">
          <h3>Match Rate</h3>
          <p>{matchRate}%</p>
        </div>

        <div className="admin-stat-card">
          <h3>Total Groups</h3>
          <p>{totalGroups}</p>
        </div>

        <div className="admin-stat-card">
          <h3>Average Group Size</h3>
          <p>{averageGroupSize}</p>
        </div>
      </div>

      <section className="admin-section">
        <h2>Create Course</h2>

        <form className="admin-form" onSubmit={handleCreateCourse}>
          <input
            name="department"
            value={courseForm.department}
            onChange={handleCourseChange}
            placeholder="Department ex: CS"
          />

          <input
            name="number"
            value={courseForm.number}
            onChange={handleCourseChange}
            placeholder="Course Number ex: 110"
          />

          <input
            name="name"
            value={courseForm.name}
            onChange={handleCourseChange}
            placeholder="Course Name"
          />

          <input
            name="section"
            value={courseForm.section}
            onChange={handleCourseChange}
            placeholder="Section"
          />

          <input
            name="instructor"
            value={courseForm.instructor}
            onChange={handleCourseChange}
            placeholder="Instructor"
          />

          <input
            name="quarter"
            value={courseForm.quarter}
            onChange={handleCourseChange}
            placeholder="Quarter ex: Spring 2026"
          />

          <button type="submit">
            Create Course
          </button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Courses</h2>

        <div className="admin-card-grid">
          {courses.length === 0 && (
            <p className="admin-empty">
              No courses found.
            </p>
          )}

          {courses.map((course) => (
            <div className="admin-data-card" key={course._id}>
              <h3>
                {course.department} {course.number}
              </h3>

              <p>{course.name}</p>
              <p>Section: {course.section || "N/A"}</p>
              <p>Instructor: {course.instructor || "N/A"}</p>
              <p>Quarter: {course.quarter}</p>
              <p>Sign-up Code: {course.signUpCode}</p>

              <button
                className="admin-danger-button"
                onClick={() => handleDeleteCourse(course._id)}
              >
                Delete Course
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Users</h2>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Major</th>
                <th>Year</th>
                <th>Courses</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="5">
                    No users found.
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.major || "N/A"}</td>
                  <td>{user.year || "N/A"}</td>
                  <td>
                    {user.courses && user.courses.length > 0
                      ? user.courses.map((course) => `${course.department} ${course.number}`).join(", ")
                      : "No courses"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2>Major Breakdown</h2>

        <div className="admin-card-grid">
          {majorBreakdown.length === 0 && (
            <p className="admin-empty">
              No major data yet.
            </p>
          )}

          {majorBreakdown.map((item) => (
            <div className="admin-data-card" key={item._id}>
              <h3>{item._id}</h3>
              <p>{item.count} users</p>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Group Size Distribution</h2>

        <div className="admin-card-grid">
          {groupSizeDistribution.length === 0 && (
            <p className="admin-empty">
              No group size data yet.
            </p>
          )}

          {groupSizeDistribution.map((item) => (
            <div className="admin-data-card" key={item._id}>
              <h3>{item._id} members</h3>
              <p>{item.count} groups</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;