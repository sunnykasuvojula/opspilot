import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';


const app=express();

app.use((req, res, next) => {
    console.log("INCOMING:", req.method, req.url);
    next();
  });
  
//security and parsinf
/**
 * 1️⃣ Prevents MIME sniffing
 * Helmet removes this header so attackers don’t know you’re using Express.
 * Forces browsers to use HTTPS (production only).
 */
app.use(helmet({
    crossOriginResourcePolicy: false
  }));
  
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