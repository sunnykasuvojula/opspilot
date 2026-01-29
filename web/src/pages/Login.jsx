import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
const Login=()=>{
    const nav=useNavigate();
    const[form,setForm]=useState({email:"",password:""});
    const [err,setErr]=useState("");
    const [loading,setLoading]=useState(false);

    function onChange(e)
    {
        const target=e?.target;
        if(!target.name) return;
        setForm((prev)=>({...prev, [target.name]:target.value}));
    };

    function saveAuth(data)
    {
        localStorage.setItem("opspilot_token",data.token);
        localStorage.setItem("opspilot_user",JSON.stringify(data.user));
        if (data.workspace) {
            localStorage.setItem("opspilot_workspace", JSON.stringify(data.workspace));
            localStorage.setItem("opspilot_activeWorkspaceId", data.workspace.id);
          }
          if (data.membership) {
            localStorage.setItem("opspilot_membership", JSON.stringify(data.membership));
          }
    }

    async function onSubmit(e)
    {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            const {data}=await api.post("/api/auth/login",{
                email:form.email.trim(),
                password:form.password,
            });
            saveAuth(data);
            nav("/app/dashboard",{replace:true});
            
        } catch (error) {
            setErr(error?.response?.data?.message || "Login Failed");
        }
        finally
        {
            setLoading(false);
        }
    }
    return(
        <div className="mx-auto w-[min(800px,92%)] mt-18 p-6 border  rounded-2xl bg-white">
        <h1 className="text-2xl font-semifold">Login</h1> 
        {err && (
  <p className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
    {err}
  </p>
)}
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input className="w-full rounded-xl border p-3 outline-none focus:ring-2" name="email" type="email" placeholder="Enter your email" value={form.email}  onChange={onChange}   required/>
        </div>
        <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input className="w-full rounded-xl border p-3 outline-none focus:ring-2" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={onChange}  required/>
        </div>
        <button disabled={loading} className="w-full rounded-xl bg-black p-3 font-medium text-white disabled:opacity-60">{loading?"Signing In...":"Login"}</button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Doesnot have an account?{" "}
        <Link className="underline" to="/register">
          Register
        </Link>
      </p>
       </div>
    )
}

export default Login;