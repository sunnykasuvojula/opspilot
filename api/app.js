import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';


const app=express();

//security and parsinf
app.use(helmet())
app.use(cors({
    origin: "http://localhost:5173/",
    credentials:true
}));
app.use(express.json());
app.use(morgan("dev"));

//Health check

app.get("/health",(req,res)=>{
    res.json({status:"OK"})

});

export default app;