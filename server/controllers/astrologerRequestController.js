const AstrologerRequest = require('../models/astrologerRequestModel');

// Create a new request
exports.createRequest = async (req, res) => {
    try {
        const { name, email, phone, expertise } = req.body;
        const newRequest = new AstrologerRequest({ name, email, phone, expertise });
        await newRequest.save();
        res.status(201).json({ success: true, message: 'Request submitted successfully', data: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to submit request', error: error.message });
    }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await AstrologerRequest.find();
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch requests', error: error.message });
    }
};

// Get a single request by ID
exports.getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await AstrologerRequest.findById(id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch request', error: error.message });
    }
};

// Update a request by ID
exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedRequest = await AstrologerRequest.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedRequest) return res.status(404).json({ success: false, message: 'Request not found' });
        res.status(200).json({ success: true, message: 'Request updated successfully', data: updatedRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update request', error: error.message });
    }
};

// Delete a request by ID
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await AstrologerRequest.findByIdAndDelete(id);
        if (!deletedRequest) return res.status(404).json({ success: false, message: 'Request not found' });
        res.status(200).json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete request', error: error.message });
    }
};