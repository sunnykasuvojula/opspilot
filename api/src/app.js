import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js"
const app=express();

app.use((req, res, next) => {
    console.log("INCOMING:", req.method, req.url);
    next();
  });
  
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

//security and parsinf
/**
 * 1️⃣ Prevents MIME sniffing
 * Helmet removes this header so attackers don’t know you’re using Express.
 * Forces browsers to use HTTPS (production only).
 */
app.use(helmet({
    crossOriginResourcePolicy: false
  }));
  
  app.use(
    cors({
      origin: [FRONTEND_URL],
      credentials: true,
    })
  );
app.use(express.json());
app.use(morgan("dev"));

//Health check

app.get("/health",(req,res)=>{
    res.json({status:"OK"})

});

app.use("/api/auth",authRoutes)

export default app;