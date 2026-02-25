import Loan from "../Models/loan.js";

const applyLoan = async (req, res) => {
    try {
        const { amount, term, purpose } = req.body;
        const userId = req.user.id;
        
        if (!amount || !term || !purpose) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        
        const newLoan = await Loan.create({ amount, term, purpose, userId });
        res.status(201).json({ success: true, message: "Loan applied successfully!", loan: newLoan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}

const getAllLoan = async (req, res) => {
    try {
        const loans = await Loan.find().populate('userId', 'Firstname Lastname Email') 
        res.status(200).json({ success: true, loans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getUserLoans = async (req, res) => {
    try {
        const userId = req.user.id;
        const loans = await Loan.find({ userId });
        res.status(200).json({ success: true, loans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }
        if (req.user.role !== "admin" && loan.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        await Loan.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Loan deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }
        // if (req.user.role !== "admin" && loan.userId.toString() !== req.user.id) {
        //     return res.status(403).json({ success: false, message: "Unauthorized" });
        // }
        const { amount, term, purpose, status } = req.body;
        const updateData = { amount, term, purpose, status }
        const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        console.log(updatedLoan);
        res.status(200).json({ success: true, message: "Loan updated successfully!", loan: updatedLoan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { applyLoan, getAllLoan, deleteLoan, updateLoan, getUserLoans };