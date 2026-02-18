import Loan from "../Models/loan.js";

const applyLoan = async (req, res) => {
    try {
        const { amount, term, purpose } = req.body;
        const userId = req.user.id; // Assuming the user ID is stored in the token  
        
        const newLoan = await Loan.create({
            amount,
            term,
            purpose,
            userId
        });

        res.status(201).json({ success: true, message: "Loan applied successfully!", loan: newLoan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getAllLoan = async (req, res) => {
    try {
        const loans = await Loan.find(); 
        res.status(200).json({ success: true, loans });
    } catch (error) {   
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const deleteLoan = async (req, res) => {
    try {
        const loanId = req.params.id;
        const deletedLoan = await Loan.findByIdAndDelete(loanId);
        if (!deletedLoan) {
            res.status(404).json({ success: false, message: "Loan not found" });
        } else {
            res.status(200).json({ success: true, message: "Loan deleted successfully!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateLoan = async (req, res) => {
    try {
        const loanId = req.params.id;
        const { amount, term, purpose } = req.body;
        const updatedLoan = await Loan.findByIdAndUpdate(loanId, { amount, term, purpose }, { new: true });

        if(!updatedLoan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }
        res.status(200).json({ success: true, message: "Loan updated successfully!", loan: updatedLoan });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully!" });
}       


export { applyLoan, getAllLoan, deleteLoan, updateLoan, logout };