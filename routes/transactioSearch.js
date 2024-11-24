const express = require("express");
const ensureAuthenticated = require("../extns/auth");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const { search } = req.query;

    // Build search criteria
    const criteria = search
      ? {
          $or: [
            { transactionId: search },
            { senderName: { $regex: search, $options: "i" } },
            { recipientName: { $regex: search, $options: "i" } },
            { senderCard: search },
            { recipientCard: search },
          ],
        }
      : {};

    const transactions = await Transaction.find(criteria).sort({ date: -1 });

    res.render("userDashboard", {
      user: req.user,
      transactions,
      title: "Transaction History",
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("An error occurred while fetching transactions.");
  }
});

module.exports = router;
