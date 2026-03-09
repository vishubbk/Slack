
/* =========================================================
   ENTERPRISE TYPING SOCKET SYSTEM (Slack-Level)
========================================================= */

// channelId -> Set of userIds currently typing
const typingUsers = new Map();

const typingSocket = (io, socket) => {

  /* ==============================
     USER START TYPING
  ============================== */
  socket.on("typing", ({ channelId, userId }) => {
    if (!typingUsers.has(channelId)) {
      typingUsers.set(channelId, new Set());
    }

    typingUsers.get(channelId).add(userId);

    io.to(`channel_${channelId}`).emit("typingUpdate", {
      channelId,
      users: Array.from(typingUsers.get(channelId)),
    });
  });

  /* ==============================
     USER STOP TYPING
  ============================== */
  socket.on("stopTyping", ({ channelId, userId }) => {
    if (typingUsers.has(channelId)) {
      typingUsers.get(channelId).delete(userId);

      io.to(`channel_${channelId}`).emit("typingUpdate", {
        channelId,
        users: Array.from(typingUsers.get(channelId)),
      });
    }
  });

  /* ==============================
     AUTO CLEANUP ON DISCONNECT
  ============================== */
  socket.on("disconnect", () => {
    typingUsers.forEach((users, channelId) => {
      if (users.has(socket.user?._id?.toString())) {
        users.delete(socket.user._id.toString());

        io.to(`channel_${channelId}`).emit("typingUpdate", {
          channelId,
          users: Array.from(users),
        });
      }
    });
  });
};

export default typingSocket;
