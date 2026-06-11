import {useEffect,useState} from "react";
import api from "../../utils/api";

function AdminDashboard() {
  const [courses,setCourses] = useState([]);
  const [users,setUsers] = useState([]);
  const [analytics,setAnalytics] = useState(null);
  const [department,setDepartment] = useState("");
  const [number,setNumber] = useState("");
  const [name,setName] = useState("");
  const [section,setSection] = useState("");
  const [instructor,setInstructor] = useState("");
  const [quarter,setQuarter] = useState("");
  const [loading,setLoading] = useState(true);
  const [message,setMessage] = useState("");

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    setMessage("");

    try {
      const coursesResponse = await api.get("/admin/courses");
      const usersResponse = await api.get("/admin/users");
      const analyticsResponse = await api.get("/admin/analytics");

      setCourses(coursesResponse.data);
      setUsers(usersResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not load admin data. Make sure your user is an admin.");
    }

    setLoading(false);
  }

  async function createCourse(event) {
    event.preventDefault();

    if (department.trim().length === 0) {
      setMessage("Department is required");
      return;
    } else if (number.trim().length === 0) {
      setMessage("Course number is required");
      return;
    } else if (name.trim().length === 0) {
      setMessage("Course name is required");
      return;
    } else if (quarter.trim().length === 0) {
      setMessage("Quarter is required");
      return;
    } else {
      setMessage("");
    }

    try {
      await api.post("/admin/courses", {
        department:department.trim(),
        number:number.trim(),
        name:name.trim(),
        section:section.trim(),
        instructor:instructor.trim(),
        quarter:quarter.trim()
      });

      setDepartment("");
      setNumber("");
      setName("");
      setSection("");
      setInstructor("");
      setQuarter("");
      setMessage("Course created in MongoDB");
      loadAdminData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create course");
    }
  }

  async function deleteCourse(courseId) {
    try {
      await api.delete(`/admin/courses/${courseId}`);
      setMessage("Course deleted from MongoDB");
      loadAdminData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete course");
    }
  }

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-hero-card">
          <h1 className="admin-title">Loading Admin Dashboard...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-hero-card">
        <div>
          <p className="admin-label">Admin Dashboard</p>
          <h1 className="admin-title">Course Management</h1>
          <p className="admin-subtitle">
            This dashboard uses /api/admin/courses, /api/admin/users, and /api/admin/analytics.
          </p>
        </div>
      </div>

      {message.length > 0 && (
        <p className="success-text">{message}</p>
      )}

      {analytics && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <p>Total Courses</p>
            <h2>{courses.length}</h2>
          </div>

          <div className="analytics-card">
            <p>Total Users</p>
            <h2>{analytics.matchRate.totalUsers}</h2>
          </div>

          <div className="analytics-card">
            <p>Matched Users</p>
            <h2>{analytics.matchRate.matchedUsers}</h2>
          </div>

          <div className="analytics-card">
            <p>Match Rate</p>
            <h2>{analytics.matchRate.percentage}%</h2>
          </div>

          <div className="analytics-card">
            <p>Total Groups</p>
            <h2>{analytics.groupSize.totalGroups}</h2>
          </div>

          <div className="analytics-card">
            <p>Avg Group Size</p>
            <h2>{analytics.groupSize.averageSize}</h2>
          </div>
        </div>
      )}

      <div className="admin-grid">
        <form className="admin-panel" onSubmit={createCourse}>
          <h2 className="panel-title">Add Course</h2>
          <p className="panel-subtitle">Creates a real course and signup code.</p>

          <div className="input-row">
            <label className="input-group">
              <span className="input-label">Department</span>
              <input
                className="input-field"
                type="text"
                placeholder="CS"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              />
            </label>

            <label className="input-group">
              <span className="input-label">Number</span>
              <input
                className="input-field"
                type="text"
                placeholder="110"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
              />
            </label>
          </div>

          <label className="input-group">
            <span className="input-label">Course Name</span>
            <input
              className="input-field"
              type="text"
              placeholder="Web Development"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <div className="input-row">
            <label className="input-group">
              <span className="input-label">Section</span>
              <input
                className="input-field"
                type="text"
                placeholder="001"
                value={section}
                onChange={(event) => setSection(event.target.value)}
              />
            </label>

            <label className="input-group">
              <span className="input-label">Quarter</span>
              <input
                className="input-field"
                type="text"
                placeholder="Spring 2026"
                value={quarter}
                onChange={(event) => setQuarter(event.target.value)}
              />
            </label>
          </div>

          <label className="input-group">
            <span className="input-label">Instructor</span>
            <input
              className="input-field"
              type="text"
              placeholder="Professor name"
              value={instructor}
              onChange={(event) => setInstructor(event.target.value)}
            />
          </label>

          <button className="main-button" type="submit">
            Create Course
          </button>
        </form>

        <section className="admin-panel admin-panel-large">
          <h2 className="panel-title">Courses</h2>
          <p className="panel-subtitle">
            Loaded from MongoDB. Use signup codes for registration/enrollment.
          </p>

          <div className="course-table">
            <div className="course-row course-row-header">
              <span>Course</span>
              <span>Name</span>
              <span>Quarter</span>
              <span>Code</span>
              <span>Action</span>
            </div>

            {courses.map((course) => (
              <div className="course-row" key={course._id}>
                <span>{course.department} {course.number}</span>
                <span>{course.name}</span>
                <span>{course.quarter}</span>
                <span>{course.signUpCode}</span>

                <button className="table-button" type="button" onClick={() => deleteCourse(course._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel admin-panel-large">
          <h2 className="panel-title">Users</h2>
          <p className="panel-subtitle">Loaded from /api/admin/users.</p>

          <div className="course-table">
            <div className="user-row user-row-header">
              <span>Name</span>
              <span>Email</span>
              <span>Major</span>
              <span>Courses</span>
              <span>Admin</span>
            </div>

            {users.map((user) => (
              <div className="user-row" key={user._id}>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.major || "None"}</span>
                <span>{user.courses.length}</span>
                <span>{user.isAdmin ? "Yes" : "No"}</span>
              </div>
            ))}
          </div>
        </section>

        {analytics && (
          <section className="admin-panel">
            <h2 className="panel-title">Major Breakdown</h2>
            <p className="panel-subtitle">Calculated by MongoDB aggregation.</p>

            <div className="availability-list">
              {analytics.majorBreakdown.length === 0 && (
                <p className="panel-subtitle">No major data yet.</p>
              )}

              {analytics.majorBreakdown.map((major) => (
                <div className="availability-card" key={major._id}>
                  <span>{major._id}</span>
                  <strong>{major.count}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;