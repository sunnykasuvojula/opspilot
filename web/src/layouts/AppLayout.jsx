import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
const AppLayout=()=>{
    return(
        <div className="min-h-screen bg-slate-100">
        <Navbar />
        <main className="pt-16 px-6">
          <Outlet />
        </main>
      </div>    
    )
}
export default AppLayout;