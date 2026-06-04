const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY;

const activeUsers = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.post("/api/heartbeat", (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  activeUsers.set(userId, Date.now());

  res.json({ ok: true });
});

app.get("/api/admin/online-count", (req, res) => {
  if (!ADMIN_KEY) {
    return res.status(500).json({ error: "Missing ADMIN_KEY" });
  }

  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const now = Date.now();

  for (const [userId, lastSeen] of activeUsers) {
    if (now - lastSeen > 5000) {
      activeUsers.delete(userId);
    }
  }

  res.json({
    online: activeUsers.size
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
