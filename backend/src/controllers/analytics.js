const Admin = require("../models/Admin");
const Message = require("../models/Message");
const Link = require("../models/Link");

const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getWeekKey = (date) => {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((temp - yearStart) / 86400000 + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

const getDateKey = (date) => date.toISOString().slice(0, 10);

const parseDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const period = String(req.query.period || "month");
    const series = [];
    const counts = new Map();
    let startDate = null;
    let endDate = null;
    let keyFn = getMonthKey;
    let labelKey = "month";

    if (period === "week") {
      keyFn = getWeekKey;
      labelKey = "week";
      for (let i = 7; i >= 0; i -= 1) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7);
        const key = getWeekKey(date);
        series.push(key);
        counts.set(key, 0);
      }
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7 * 7);
      endDate = now;
    } else if (period === "custom") {
      const startValue = parseDate(req.query.start);
      const endValue = parseDate(req.query.end);
      if (!startValue || !endValue) {
        return res.status(400).json({ message: "start and end dates are required" });
      }
      startDate = startValue;
      endDate = endValue;
      keyFn = getDateKey;
      labelKey = "date";

      const cursor = new Date(startDate);
      cursor.setHours(0, 0, 0, 0);
      const endCursor = new Date(endDate);
      endCursor.setHours(0, 0, 0, 0);

      while (cursor <= endCursor) {
        const key = getDateKey(cursor);
        series.push(key);
        counts.set(key, 0);
        cursor.setDate(cursor.getDate() + 1);
      }
    } else {
      for (let i = 5; i >= 0; i -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = getMonthKey(date);
        series.push(key);
        counts.set(key, 0);
      }
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      endDate = now;
    }

    const messages = await Message.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).select("createdAt");

    messages.forEach((message) => {
      const key = keyFn(message.createdAt);
      if (counts.has(key)) {
        counts.set(key, counts.get(key) + 1);
      }
    });

    const contactsSeries = series.map((key) => ({ [labelKey]: key, count: counts.get(key) || 0 }));

    const [pendingAdmins, approvedAdmins, rejectedAdmins] = await Promise.all([
      Admin.countDocuments({ status: "pending" }),
      Admin.countDocuments({ status: "approved" }),
      Admin.countDocuments({ status: "rejected" }),
    ]);

    const links = await Link.find().select("label clicks");
    const linkClicks = links.map((link) => ({ label: link.label, clicks: link.clicks || 0 }));

    res.json({
      adminRequests: {
        pending: pendingAdmins,
        approved: approvedAdmins,
        rejected: rejectedAdmins,
      },
      contactsMonthly: period === "month" ? contactsSeries : [],
      contactsSeries,
      period,
      linkClicks,
      totals: {
        contacts: messages.length,
        links: links.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview };
