
/* =========================================================
   ENTERPRISE NOTIFICATION SOCKET SYSTEM (Slack-Level)
========================================================= */

// In-memory tracking (can be replaced with Redis later)
const userNotificationCount = new Map();

const notificationSocket = (io, socket) => {

  /* ==============================
     JOIN USER PERSONAL ROOM
  ============================== */
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);

    if (!userNotificationCount.has(userId)) {
      userNotificationCount.set(userId, 0);
    }
  });

  /* ==============================
     SEND NOTIFICATION
  ============================== */
  socket.on("sendNotification", ({ userId, notification }) => {

    const enrichedNotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false,
    };

    // Increase unread count
    const currentCount = userNotificationCount.get(userId) || 0;
    userNotificationCount.set(userId, currentCount + 1);

    io.to(`user_${userId}`).emit("receiveNotification", enrichedNotification);

    io.to(`user_${userId}`).emit("notificationCountUpdate", {
      unreadCount: userNotificationCount.get(userId),
    });
  });

  /* ==============================
     MARK NOTIFICATION AS READ
  ============================== */
  socket.on("markNotificationRead", ({ userId }) => {
    userNotificationCount.set(userId, 0);

    io.to(`user_${userId}`).emit("notificationCountUpdate", {
      unreadCount: 0,
    });
  });

  /* ==============================
     CLEAR ALL NOTIFICATIONS
  ============================== */
  socket.on("clearNotifications", ({ userId }) => {
    userNotificationCount.set(userId, 0);

    io.to(`user_${userId}`).emit("notificationsCleared");

    io.to(`user_${userId}`).emit("notificationCountUpdate", {
      unreadCount: 0,
    });
  });

  /* ==============================
     DISCONNECT HANDLING
  ============================== */
  socket.on("disconnect", () => {
    // Optional: cleanup logic if needed
  });
};

export default notificationSocket;
