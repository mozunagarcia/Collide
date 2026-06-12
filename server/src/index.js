const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const { verifyToken } = require("./utils/token");
const User = require("./models/User");
const Match = require("./models/Match");
const Message = require("./models/Message");
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.json({ message: "Collide API running" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/swipe", require("./routes/swipe"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/groups", require("./routes/groups"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

// Authenticate every socket connection with the user's JWT
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));
    const decoded = verifyToken(token);
    socket.user = await User.findById(decoded.id).select("-password");
    if (!socket.user) return next(new Error("User not found"));
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  // Join the room for a specific match and receive message history
  socket.on("join_match", async ({ matchId }) => {
    try {
      const match = await Match.findOne({ _id: matchId, users: socket.user._id });
      if (!match) return socket.emit("error", "Not authorized for this match");

      socket.join(`match_${matchId}`);

      const history = await Message.find({ match: matchId })
        .sort({ createdAt: 1 })
        .populate("sender", "name profilePhoto");
      socket.emit("message_history", history);
    } catch (err) {
      socket.emit("error", "Failed to join match");
    }
  });

  socket.on("leave_match", ({ matchId }) => {
    socket.leave(`match_${matchId}`);
  });

  // Send a message to a match room
  socket.on("send_message", async ({ matchId, content }) => {
    try {
      if (!content?.trim()) return;
      const match = await Match.findOne({ _id: matchId, users: socket.user._id });
      if (!match) return socket.emit("error", "Not authorized for this match");

      const message = await Message.create({
        match: matchId,
        sender: socket.user._id,
        content: content.trim(),
      });
      await message.populate("sender", "name profilePhoto");

      io.to(`match_${matchId}`).emit("receive_message", message);
    } catch (err) {
      socket.emit("error", "Failed to send message");
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
