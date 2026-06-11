import { useState } from "react";
import api from "../../utils/api";

const SKILL_OPTIONS = [
  "Python", "JavaScript", "Java", "C++", "C", "React", "Node.js",
  "SQL", "MongoDB", "HTML/CSS", "Machine Learning", "Data Analysis",
  "UI/UX", "Figma", "MATLAB", "Circuit Design", "Technical Writing",
  "Research", "Presentations", "Git",
];

function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user.name || "",
    major: user.major || "",
    year: user.year || "",
    bio: user.bio || "",
    skillTags: user.skillTags || [],
    location: user.workingStyle?.location || "",
    pace: user.workingStyle?.pace || "",
    hours: user.workingStyle?.hours || "",
    communicationStyle: user.workingStyle?.communicationStyle || "",
    groupSizePreference: user.groupSizePreference || "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user.profilePhoto || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: updated } = await api.patch("/users/me", {
        name: form.name,
        major: form.major,
        year: form.year || undefined,
        bio: form.bio,
        skillTags: form.skillTags,
        workingStyle: {
          location: form.location || undefined,
          pace: form.pace || undefined,
          hours: form.hours || undefined,
          communicationStyle: form.communicationStyle || undefined,
        },
        groupSizePreference: form.groupSizePreference || undefined,
      });

      let finalUser = updated;

      if (photoFile) {
        try {
          const formData = new FormData();
          formData.append("photo", photoFile);
          const { data: withPhoto } = await api.post("/users/me/photo", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          finalUser = withPhoto;
        } catch (photoErr) {
          setError("Profile saved but photo upload failed — check Cloudinary credentials in .env");
          onSave(finalUser);
          setLoading(false);
          return;
        }
      }

      onSave(finalUser);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSave}>

          <div className="modal-photo-section">
            <div className="modal-avatar">
              {photoPreview
                ? <img src={photoPreview} alt="preview" className="modal-avatar-img" />
                : <span>{user.name.charAt(0).toUpperCase()}</span>
              }
            </div>
            <label className="photo-upload-label">
              Change Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
            </label>
          </div>

          <div className="modal-row">
            <label className="input-group">
              <span className="input-label">Full Name</span>
              <input className="input-field" name="name" value={form.name} onChange={handleChange} />
            </label>
            <label className="input-group">
              <span className="input-label">Major</span>
              <input className="input-field" name="major" value={form.major} onChange={handleChange} />
            </label>
          </div>

          <div className="modal-row">
            <label className="input-group">
              <span className="input-label">Year</span>
              <select className="input-field" name="year" value={form.year} onChange={handleChange}>
                <option value="">Select year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </label>
            <label className="input-group">
              <span className="input-label">Group Size Preference</span>
              <select className="input-field" name="groupSizePreference" value={form.groupSizePreference} onChange={handleChange}>
                <option value="">Select size</option>
                <option value="Small (2-3)">Small (2-3)</option>
                <option value="Medium (4-6)">Medium (4-6)</option>
                <option value="Large (7+)">Large (7+)</option>
              </select>
            </label>
          </div>

          <label className="input-group">
            <span className="input-label">Bio</span>
            <textarea className="input-field modal-textarea" name="bio" value={form.bio} onChange={handleChange} rows={3} />
          </label>

          <div className="input-group">
            <span className="input-label">Skill Tags</span>
            <div className="skill-grid">
              {SKILL_OPTIONS.map((skill) => (
                <label key={skill} className={`skill-option ${form.skillTags.includes(skill) ? "skill-option-selected" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form.skillTags.includes(skill)}
                    onChange={() => {
                      const updated = form.skillTags.includes(skill)
                        ? form.skillTags.filter((s) => s !== skill)
                        : [...form.skillTags, skill];
                      setForm({ ...form, skillTags: updated });
                    }}
                    hidden
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>

          <p className="input-label" style={{ marginBottom: 10 }}>Working Style</p>
          <div className="modal-row">
            <label className="input-group">
              <span className="input-label">Location</span>
              <select className="input-field" name="location" value={form.location} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Remote">Remote</option>
                <option value="In-person">In-person</option>
                <option value="Flexible">Flexible</option>
              </select>
            </label>
            <label className="input-group">
              <span className="input-label">Preferred Hours</span>
              <select className="input-field" name="hours" value={form.hours} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </label>
          </div>

          <div className="modal-row">
            <label className="input-group">
              <span className="input-label">Pace</span>
              <select className="input-field" name="pace" value={form.pace} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Well ahead of deadline">Well ahead of deadline</option>
                <option value="Balanced">Balanced</option>
                <option value="Close to deadline">Close to deadline</option>
              </select>
            </label>
            <label className="input-group">
              <span className="input-label">Communication</span>
              <select className="input-field" name="communicationStyle" value={form.communicationStyle} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Very frequent">Very frequent</option>
                <option value="Regular check-ins">Regular check-ins</option>
                <option value="As needed">As needed</option>
              </select>
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="modal-cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="main-button modal-save-button" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
