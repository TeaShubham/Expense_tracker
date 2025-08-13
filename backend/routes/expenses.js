const express = require('express');
const { Op } = require('sequelize');
const Expense = require('../models/Expense');
const authenticateToken = require('../middleware/auth');

const router = express.Router();


router.use(authenticateToken);


router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { category, amount, comments } = req.body;

    
    if (!category || !amount) {
      return res.status(400).json({ error: 'Category and amount are required' });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const expense = await Expense.create({
      category: category.trim(),
      amount: parseFloat(amount),
      comments: comments ? comments.trim() : null,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Expense added successfully',
      expense
    });

  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, comments } = req.body;

   
    if (!category || !amount) {
      return res.status(400).json({ error: 'Category and amount are required' });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    
    const expense = await Expense.findOne({
      where: { 
        id: id, 
        userId: req.user.id 
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    
    await expense.update({
      category: category.trim(),
      amount: parseFloat(amount),
      comments: comments ? comments.trim() : null
    });

    res.json({
      message: 'Expense updated successfully',
      expense
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    
    const expense = await Expense.findOne({
      where: { 
        id: id, 
        userId: req.user.id 
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy();

    res.json({ message: 'Expense deleted successfully' });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});


router.get('/stats', async (req, res) => {
  try {
    const { Sequelize } = require('sequelize');
    
    const stats = await Expense.findAll({
      where: { userId: req.user.id },
      attributes: [
        'category',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['category'],
      order: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'DESC']]
    });

    
    const totalExpenses = stats.reduce((sum, stat) => sum + parseFloat(stat.dataValues.total), 0);

    
    const statsWithPercentage = stats.map(stat => ({
      category: stat.category,
      total: parseFloat(stat.dataValues.total),
      count: parseInt(stat.dataValues.count),
      percentage: totalExpenses > 0 ? ((parseFloat(stat.dataValues.total) / totalExpenses) * 100).toFixed(2) : 0
    }));

    res.json({
      stats: statsWithPercentage,
      totalExpenses: totalExpenses
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch expense statistics' });
  }
});

module.exports = router;