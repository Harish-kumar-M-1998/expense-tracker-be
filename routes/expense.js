const express = require("express");
const Expense = require("../models/Expense");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token is required' });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        // Decode the token payload
        const decoded = jwt.verify(token, 'harishjwt');
        req.user = decoded; // Attach the decoded payload to the request object
        next(); // Proceed to the next middleware
    } catch (err) {
        console.log(err)
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Add Expense
router.post("/", verifyToken, async (req, res) => {
  const { title, amount } = req.body;
  try {
    const expense = new Expense({ title, amount, user: req.user.id });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get User Expenses
router.get("/", verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Expense
router.put("/:id", verifyToken, async (req, res) => {
    const { title, amount } = req.body;
    const expenseId = req.params.id;
  
    try {
      // Find the expense by ID and update it
      const updatedExpense = await Expense.findOneAndUpdate(
        { _id: expenseId, user: req.user.id }, // Ensure the user owns the expense
        { title, amount },
        { new: true, runValidators: true } // Return the updated document and run validators
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found or you do not have permission to edit it.' });
      }
  
      res.json(updatedExpense);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Delete Expense
router.delete("/:id", verifyToken, async (req, res) => {
    const expenseId = req.params.id;
  
    try {
      // Find the expense by ID and delete it
      const deletedExpense = await Expense.findOneAndDelete({
        _id: expenseId,
        user: req.user.id, // Ensure the user owns the expense
      });
  
      if (!deletedExpense) {
        return res.status(404).json({ message: 'Expense not found or you do not have permission to delete it.' });
      }
  
      res.json({ message: 'Expense deleted successfully.' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

module.exports = router;
