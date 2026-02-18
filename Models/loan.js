import mongoose from 'mongoose';

const loanSchema = mongoose.Schema({
    amount:{
        type:String,
        required:true
    },
    term:{
        type:String,
        required:true,
        enum:["6 months", "12 months", "18 months", "24 months"]
    },
    purpose:{
        type:String,
        required:true,
        enum:["Education", "Business", "Personal", "Medical", "Other"]
    },
    status:{
        type:String,
        enum:["pending", "approved", "rejected"],
        default:"pending"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{ timestamps:true })

const Loan = mongoose.model('Loan',loanSchema);
export default Loan;