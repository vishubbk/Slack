
/* =========================================================
   ENTERPRISE CHANNEL SOCKET SYSTEM (Slack-Level)
========================================================= */

const activeUsers = new Map(); // channelId -> Set(userIds)

const channelSocket = (io, socket) => {
  /* ==============================
     JOIN CHANNEL ROOM
  ============================== */
  socket.on("joinChannel", ({ channelId, userId }) => {
    socket.join(`channel_${channelId}`);

    if (!activeUsers.has(channelId)) {
      activeUsers.set(channelId, new Set());
    }

    activeUsers.get(channelId).add(userId);

    io.to(`channel_${channelId}`).emit("channelUsersUpdate", {
      channelId,
      users: Array.from(activeUsers.get(channelId)),
    });
  });

  /* ==============================
     LEAVE CHANNEL
  ============================== */
  socket.on("leaveChannel", ({ channelId, userId }) => {
    socket.leave(`channel_${channelId}`);

    if (activeUsers.has(channelId)) {
      activeUsers.get(channelId).delete(userId);

      io.to(`channel_${channelId}`).emit("channelUsersUpdate", {
        channelId,
        users: Array.from(activeUsers.get(channelId)),
      });
    }
  });

  /* ==============================
     TYPING INDICATOR
  ============================== */
  socket.on("typing", ({ channelId, userId }) => {
    socket.to(`channel_${channelId}`).emit("userTyping", { userId });
  });

  socket.on("stopTyping", ({ channelId, userId }) => {
    socket.to(`channel_${channelId}`).emit("userStoppedTyping", { userId });
  });

  /* ==============================
     MESSAGE READ RECEIPT
  ============================== */
  socket.on("markAsRead", ({ channelId, messageId, userId }) => {
    io.to(`channel_${channelId}`).emit("messageRead", {
      messageId,
      userId,
    });
  });

  /* ==============================
     MESSAGE PIN / UNPIN
  ============================== */
  socket.on("pinMessage", ({ channelId, messageId, userId }) => {
    io.to(`channel_${channelId}`).emit("messagePinned", {
      messageId,
      pinnedBy: userId,
    });
  });

  socket.on("unpinMessage", ({ channelId, messageId }) => {
    io.to(`channel_${channelId}`).emit("messageUnpinned", {
      messageId,
    });
  });

  /* ==============================
     REACTION ADDED / REMOVED
  ============================== */
  socket.on("addReaction", ({ channelId, messageId, emoji, userId }) => {
    io.to(`channel_${channelId}`).emit("reactionAdded", {
      messageId,
      emoji,
      userId,
    });
  });

  socket.on("removeReaction", ({ channelId, messageId, emoji, userId }) => {
    io.to(`channel_${channelId}`).emit("reactionRemoved", {
      messageId,
      emoji,
      userId,
    });
  });

  /* ==============================
     THREAD MESSAGE EVENT
  ============================== */
  socket.on("threadMessage", ({ channelId, parentMessageId, message }) => {
    io.to(`channel_${channelId}`).emit("newThreadMessage", {
      parentMessageId,
      message,
    });
  });

  /* ==============================
     MESSAGE EDIT / DELETE
  ============================== */
  socket.on("editMessage", ({ channelId, messageId, content }) => {
    io.to(`channel_${channelId}`).emit("messageEdited", {
      messageId,
      content,
    });
  });

  socket.on("deleteMessage", ({ channelId, messageId }) => {
    io.to(`channel_${channelId}`).emit("messageDeleted", {
      messageId,
    });
  });

  /* ==============================
     DISCONNECT CLEANUP
  ============================== */
  socket.on("disconnect", () => {
    activeUsers.forEach((users, channelId) => {
      users.forEach((userId) => {
        if (!socket.rooms.has(`channel_${channelId}`)) return;
        users.delete(userId);
      });

      io.to(`channel_${channelId}`).emit("channelUsersUpdate", {
        channelId,
        users: Array.from(users),
      });
    });
  });
};

export default channelSocket;
