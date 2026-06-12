// TODO: GroupSpace page
import { useEffect, useState } from "react";
import api from "../utils/api";
function GroupSpace() {
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [signUpCode, setSignUpCode] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [groupForm, setGroupForm] = useState({
    name: "",
    courseId: "",
    description: "",
    maxSize: "6",
    meetingSchedule: ""
  });
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    maxSize: "6",
    meetingSchedule: "",
    sharedLinks: "",
    status: "forming"
  });

  async function loadGroupSpaceData() {
    try {
      const coursesRes = await api.get("/courses/mine");
      const groupsRes = await api.get("/groups/mine");

      setCourses(coursesRes.data);
      setGroups(groupsRes.data);
    } catch (err) {
      setMessage("Could not load Groupspace data.");
    }
  }

  useEffect(() => {
    loadGroupSpaceData();
  }, []);

  function handleGroupFormChange(e) {
    setGroupForm({
      ...groupForm,
      [e.target.name]: e.target.value
    });
  }

  function handleEditFormChange(e) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  }

  async function handleEnrollCourse(e) {
    e.preventDefault();

    if (!signUpCode.trim()) {
      setMessage("Please enter a course sign-up code.");
      return;
    }

    try {
      const res = await api.post("/courses/enroll", {
        signUpCode: signUpCode
      });

      setMessage(res.data.message || "Enrolled successfully.");
      setSignUpCode("");
      loadGroupSpaceData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not enroll in course.");
    }
  }

  async function handleCreateGroup(e) {
    e.preventDefault();

    if (!groupForm.name.trim()) {
      setMessage("Please enter a group name.");
      return;
    } else if (!groupForm.courseId) {
      setMessage("Please choose a course.");
      return;
    }

    try {
      await api.post("/groups", {
        name: groupForm.name,
        courseId: groupForm.courseId,
        description: groupForm.description,
        maxSize: Number(groupForm.maxSize),
        meetingSchedule: groupForm.meetingSchedule
      });

      setGroupForm({
        name: "",
        courseId: "",
        description: "",
        maxSize: "6",
        meetingSchedule: ""
      });

      setMessage("Group created successfully.");
      loadGroupSpaceData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create group.");
    }
  }

  async function handleViewGroup(groupId) {
    try {
      const res = await api.get(`/groups/${groupId}`);
      const group = res.data;

      setSelectedGroup(group);

      let sharedLinksText = "";

      if (group.sharedLinks && group.sharedLinks.length > 0) {
        sharedLinksText = group.sharedLinks.join("\n");
      }

      setEditForm({
        name: group.name || "",
        description: group.description || "",
        maxSize: String(group.maxSize || 6),
        meetingSchedule: group.meetingSchedule || "",
        sharedLinks: sharedLinksText,
        status: group.status || "forming"
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not open group.");
    }
  }

  async function handleUpdateGroup(e) {
    e.preventDefault();

    if (!selectedGroup) {
      setMessage("Please select a group first.");
      return;
    }

    const sharedLinks = editForm.sharedLinks
      .split("\n")
      .map((link) => link.trim())
      .filter((link) => link.length > 0);

    try {
      const res = await api.patch(`/groups/${selectedGroup._id}`, {
        name: editForm.name,
        description: editForm.description,
        maxSize: Number(editForm.maxSize),
        meetingSchedule: editForm.meetingSchedule,
        sharedLinks: sharedLinks,
        status: editForm.status
      });

      setSelectedGroup(res.data);
      setMessage("Group updated successfully.");
      loadGroupSpaceData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Only the group creator can update this group.");
    }
  }

  async function handleJoinGroup(e) {
    e.preventDefault();

    if (!joinGroupId.trim()) {
      setMessage("Please enter a join code.");
      return;
    }

    try {
      await api.post("/groups/join", { joinCode: joinGroupId.trim() });
      setMessage("Joined group successfully.");
      setJoinGroupId("");
      loadGroupSpaceData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not join group.");
    }
  }

  async function handleLeaveGroup(groupId) {
    const confirmed = window.confirm("Are you sure you want to leave this group?");

    if (!confirmed) {
      return;
    }

    try {
      await api.post(`/groups/${groupId}/leave`);
      setMessage("Left group successfully.");

      if (selectedGroup && selectedGroup._id === groupId) {
        setSelectedGroup(null);
      }

      loadGroupSpaceData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not leave group.");
    }
  }

  function formatCourse(course) {
    let text = "No course";

    if (course) {
      text = `${course.department} ${course.number} - ${course.name}`;
    }

    return text;
  }

  function formatMembers(group) {
    let text = "0 members";

    if (group && group.members) {
      text = `${group.members.length} / ${group.maxSize} members`;
    }

    return text;
  }

  return (
    <div className="groupspace-page">
      <div className="groupspace-header">
        <div>
          <h1>Groupspace</h1>
          <p>Create, join, view, and manage your study groups.</p>
        </div>
      </div>

      {message && (
        <p className="groupspace-message">
          {message}
        </p>
      )}

      <div className="groupspace-layout">
        <div className="groupspace-left">
          <section className="groupspace-section">
            <h2>Enroll in a Course</h2>

            <form className="groupspace-form" onSubmit={handleEnrollCourse}>
              <input
                value={signUpCode}
                onChange={(e) => setSignUpCode(e.target.value)}
                placeholder="Enter course sign-up code"
              />

              <button type="submit">
                Enroll
              </button>
            </form>
          </section>

          <section className="groupspace-section">
            <h2>Create a Group</h2>

            <form className="groupspace-form" onSubmit={handleCreateGroup}>
              <input
                name="name"
                value={groupForm.name}
                onChange={handleGroupFormChange}
                placeholder="Group name"
              />

              <select
                name="courseId"
                value={groupForm.courseId}
                onChange={handleGroupFormChange}
              >
                <option value="">Choose course</option>

                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.department} {course.number} - {course.name}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                value={groupForm.description}
                onChange={handleGroupFormChange}
                placeholder="Group description"
              />

              <input
                name="maxSize"
                value={groupForm.maxSize}
                onChange={handleGroupFormChange}
                type="number"
                min="2"
                max="20"
                placeholder="Max size"
              />

              <input
                name="meetingSchedule"
                value={groupForm.meetingSchedule}
                onChange={handleGroupFormChange}
                placeholder="Meeting schedule"
              />

              <button type="submit">
                Create Group
              </button>
            </form>
          </section>

          <section className="groupspace-section">
            <h2>Join a Group</h2>

            <form className="groupspace-form" onSubmit={handleJoinGroup}>
              <input
                value={joinGroupId}
                onChange={(e) => setJoinGroupId(e.target.value)}
                placeholder="Enter group join code"
              />

              <button type="submit">
                Join Group
              </button>
            </form>
          </section>
        </div>

        <div className="groupspace-right">
          <section className="groupspace-section">
            <h2>My Courses</h2>

            <div className="groupspace-card-list">
              {courses.length === 0 && (
                <p className="groupspace-empty">
                  You are not enrolled in any courses yet.
                </p>
              )}

              {courses.map((course) => (
                <div className="groupspace-small-card" key={course._id}>
                  <h3>{course.department} {course.number}</h3>
                  <p>{course.name}</p>
                  <p>Section: {course.section || "N/A"}</p>
                  <p>Instructor: {course.instructor || "N/A"}</p>
                  <p>Quarter: {course.quarter}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="groupspace-section">
            <h2>My Groups</h2>

            <div className="groupspace-card-list">
              {groups.length === 0 && (
                <p className="groupspace-empty">
                  You are not in any groups yet.
                </p>
              )}

              {groups.map((group) => (
                <div className="groupspace-group-card" key={group._id}>
                  <div>
                    <h3>{group.name}</h3>
                    <p>{formatCourse(group.course)}</p>
                    <p>{formatMembers(group)}</p>
                    <p>Status: {group.status}</p>
                    <p className="groupspace-group-id">Join Code: {group.joinCode}</p>
                  </div>

                  <div className="groupspace-card-actions">
                    <button onClick={() => handleViewGroup(group._id)}>
                      Open
                    </button>

                    <button
                      className="groupspace-danger-button"
                      onClick={() => handleLeaveGroup(group._id)}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {selectedGroup && (
        <section className="groupspace-section groupspace-detail-section">
          <h2>Selected Group</h2>

          <div className="groupspace-detail-grid">
            <div className="groupspace-detail-card">
              <h3>{selectedGroup.name}</h3>
              <p>{formatCourse(selectedGroup.course)}</p>
              <p>{formatMembers(selectedGroup)}</p>
              <p>Status: {selectedGroup.status}</p>
              <p>Meeting: {selectedGroup.meetingSchedule || "No meeting schedule yet"}</p>
              <p>{selectedGroup.description || "No description yet."}</p>

              <h4>Members</h4>

              <div className="groupspace-members">
                {selectedGroup.members.map((member) => (
                  <div className="groupspace-member" key={member._id}>
                    <div className="groupspace-member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p>{member.name}</p>
                      <span>{member.email}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h4>Shared Links</h4>

              <div className="groupspace-links">
                {selectedGroup.sharedLinks && selectedGroup.sharedLinks.length === 0 && (
                  <p>No shared links yet.</p>
                )}

                {selectedGroup.sharedLinks &&
                  selectedGroup.sharedLinks.map((link) => (
                    <a href={link} target="_blank" rel="noreferrer" key={link}>
                      {link}
                    </a>
                  ))}
              </div>
            </div>

            <form className="groupspace-edit-form" onSubmit={handleUpdateGroup}>
              <h3>Edit Group</h3>

              <input
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
                placeholder="Group name"
              />

              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                placeholder="Description"
              />

              <input
                name="maxSize"
                value={editForm.maxSize}
                onChange={handleEditFormChange}
                type="number"
                min="2"
                max="20"
              />

              <input
                name="meetingSchedule"
                value={editForm.meetingSchedule}
                onChange={handleEditFormChange}
                placeholder="Meeting schedule"
              />

              <textarea
                name="sharedLinks"
                value={editForm.sharedLinks}
                onChange={handleEditFormChange}
                placeholder="Shared links, one per line"
              />

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditFormChange}
              >
                <option value="forming">forming</option>
                <option value="active">active</option>
                <option value="completed">completed</option>
              </select>

              <button type="submit">
                Save Changes
              </button>

              <p className="groupspace-note">
                Only the group creator can update group details.
              </p>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

export default GroupSpace;