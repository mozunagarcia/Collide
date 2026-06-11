const Group = require("../models/Group");
const User = require("../models/User");

const createGroup = async (req, res) => {
  try {
    const { name, courseId, description, maxSize, meetingSchedule } = req.body;

    if (!name || !courseId) {
      return res.status(400).json({ message: "name and courseId are required" });
    }

    const isEnrolled = req.user.courses.some((c) => c.toString() === courseId);
    if (!isEnrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    const group = await Group.create({
      name,
      course: courseId,
      createdBy: req.user._id,
      members: [req.user._id],
      description,
      maxSize,
      meetingSchedule,
    });

    await group.populate("members", "-password");
    await group.populate("course", "department number name quarter");

    res.status(201).json(group);
  } catch (err) {
    console.error("createGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "-password")
      .populate("course", "department number name quarter");
    res.json(groups);
  } catch (err) {
    console.error("getMyGroups error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "-password")
      .populate("course", "department number name quarter")
      .populate("createdBy", "name");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    res.json(group);
  } catch (err) {
    console.error("getGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { name, description, maxSize, meetingSchedule, sharedLinks, status } = req.body;

    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the group creator can update group details" });
    }

    const updated = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description, maxSize, meetingSchedule, sharedLinks, status },
      { new: true, runValidators: true }
    )
      .populate("members", "-password")
      .populate("course", "department number name quarter");

    res.json(updated);
  } catch (err) {
    console.error("updateGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isEnrolled = req.user.courses.some((c) => c.toString() === group.course.toString());
    if (!isEnrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    const alreadyMember = group.members.some((m) => m.toString() === req.user._id.toString());
    if (alreadyMember) {
      return res.status(409).json({ message: "Already a member of this group" });
    }

    if (group.members.length >= group.maxSize) {
      return res.status(400).json({ message: "Group is full" });
    }

    group.members.push(req.user._id);
    await group.save();
    await group.populate("members", "-password");
    await group.populate("course", "department number name quarter");

    res.json(group);
  } catch (err) {
    console.error("joinGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    group.members = group.members.filter((m) => m.toString() !== req.user._id.toString());
    await group.save();

    res.json({ message: "Left group successfully" });
  } catch (err) {
    console.error("leaveGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createGroup, getMyGroups, getGroup, updateGroup, joinGroup, leaveGroup };
