const Note = require('../models/Note');

// @desc    Get notes for a lead
// @route   GET /api/notes/:leadId
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ leadId: req.params.leadId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { leadId, content, createdBy } = req.body;

    // Validation
    if (!leadId || !content || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide leadId, content, and createdBy',
      });
    }

    const note = await Note.create({
      leadId,
      content,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
};
