
/* =========================================================
   ENTERPRISE MESSAGE SOCKET SYSTEM (Slack-Level)
========================================================= */

const messageSocket = (io, socket) => {

  /* ==============================
     SEND MESSAGE (Real-time Emit)
  ============================== */
  socket.on("sendMessage", (data) => {
    const { channelId } = data;

    io.to(`channel_${channelId}`).emit("receiveMessage", {
      ...data,
      deliveredAt: new Date(),
    });
  });

  /* ==============================
     MESSAGE DELIVERED ACK
  ============================== */
  socket.on("messageDelivered", ({ messageId, channelId, userId }) => {
    io.to(`channel_${channelId}`).emit("messageDeliveredUpdate", {
      messageId,
      userId,
    });
  });

  /* ==============================
     MESSAGE SEEN (Read Receipt)
  ============================== */
  socket.on("messageSeen", ({ messageId, channelId, userId }) => {
    io.to(`channel_${channelId}`).emit("messageSeenUpdate", {
      messageId,
      userId,
      seenAt: new Date(),
    });
  });

  /* ==============================
     EDIT MESSAGE
  ============================== */
  socket.on("editMessage", ({ messageId, channelId, content }) => {
    io.to(`channel_${channelId}`).emit("messageEdited", {
      messageId,
      content,
      editedAt: new Date(),
    });
  });

  /* ==============================
     DELETE MESSAGE
  ============================== */
  socket.on("deleteMessage", ({ messageId, channelId }) => {
    io.to(`channel_${channelId}`).emit("messageDeleted", {
      messageId,
    });
  });

  /* ==============================
     ADD REACTION
  ============================== */
  socket.on("addReaction", ({ messageId, channelId, emoji, userId }) => {
    io.to(`channel_${channelId}`).emit("reactionAdded", {
      messageId,
      emoji,
      userId,
    });
  });

  /* ==============================
     REMOVE REACTION
  ============================== */
  socket.on("removeReaction", ({ messageId, channelId, emoji, userId }) => {
    io.to(`channel_${channelId}`).emit("reactionRemoved", {
      messageId,
      emoji,
      userId,
    });
  });

  /* ==============================
     THREAD MESSAGE EVENT
  ============================== */
  socket.on("threadReply", ({ parentMessageId, channelId, message }) => {
    io.to(`channel_${channelId}`).emit("newThreadReply", {
      parentMessageId,
      message,
    });
  });

  /* ==============================
     MESSAGE PIN / UNPIN
  ============================== */
  socket.on("pinMessage", ({ messageId, channelId, userId }) => {
    io.to(`channel_${channelId}`).emit("messagePinned", {
      messageId,
      pinnedBy: userId,
      pinnedAt: new Date(),
    });
  });

  socket.on("unpinMessage", ({ messageId, channelId }) => {
    io.to(`channel_${channelId}`).emit("messageUnpinned", {
      messageId,
    });
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
     MESSAGE ERROR HANDLING
  ============================== */
  socket.on("messageError", (error) => {
    console.error("Message Socket Error:", error);
  });
};

export default messageSocket;
