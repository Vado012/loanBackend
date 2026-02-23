import mongoose from 'mongoose';

const loanSchema = mongoose.Schema({
    amount:{
        type:String,
        required:true
    },
    term:{
        type:Number,
        required:true,
        enum:[6 , 12, 18, 24]
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