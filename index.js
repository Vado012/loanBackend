import e from 'express';
import { config } from 'dotenv';
import mongoose, { get } from 'mongoose';
import userRoutes from './routes/UserRoutes.js';
import  LoanRoutes from './routes/LoanRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

config()
const app = e();
const port = process.env.PORT || 4000 ;

app.use(e.json());
app.use(e.urlencoded({extended:true}));
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));


app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.use('/api/user', userRoutes)
app.use('/api/loan', LoanRoutes)

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`); 
})
