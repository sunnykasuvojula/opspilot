import { use, useState } from "react";
import {Link,useNavigate} from 'react-router-dom';
import api from "@/lib/api";
const Register=()=>{
    const nav=useNavigate();
    const [form,setForm]=useState({name:"",email:"",password:""})
    const [loading,setLoading]=useState(false);
    const[err,setErr]=useState("");

    const onChange = (e) => {
        const target = e?.target;
        if (!target?.name) return;
        
        setForm((prev) => ({
          ...prev,
          [target.name]: target.value,
        }));
      };
      

    //saveAuth: Stores auth data in localStorage
    function saveAuth(data)
    {
      // backend returns: { token, user, workspace, membership }
      localStorage.setItem("opspilot_token",data.token);
      localStorage.setItem("opspilot_user",JSON.stringify(data.user));
      if(data.workspace)
      {
        localStorage.setItem("opspilot_workspace",JSON.stringify(data.workspace));
        localStorage.setItem("opspilot_activeWorkspaceId",data.workspace.id);
      }

      if(data.membership)
      {
        localStorage.setItem("opspilot_membership",JSON.stringify(data.membership));
      }
    }
     async function onSubmit(e){
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            const {data}=await api.post("/api/auth/register",{
                name:form.name.trim(),
                email:form.email.trim(),
                password:form.password,
            });

            saveAuth(data);
            nav("/login",{replace:true});
            
        } catch (error) {
            setErr(error?.response?.data?.message || "Register failed");
        }
        finally{
            setLoading(false);
        }
    }
    return(
       <div className="mx-auto w-[min(800px,92%)] mt-18 p-6 border  rounded-2xl bg-white">
        <h1 className="text-2xl font-semifold">Create Account</h1> 
        <p className="mt-1 text-sm text-slate-600">
        Create your OpsPilot workspace automatically.
      </p>
      {err && (
  <p className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
    {err}
  </p>
)}
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input className="w-full rounded-xl border p-3 outline-none focus:ring-2" name="name" placeholder="Enter your name" onChange={onChange} value={form.name}  required/>
        </div>
        <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input className="w-full rounded-xl border p-3 outline-none focus:ring-2" name="email" type="email" placeholder="Enter your email" onChange={onChange} value={form.email}  required/>
        </div>
        <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input className="w-full rounded-xl border p-3 outline-none focus:ring-2" name="password" type="password" placeholder="Enter your password" onChange={onChange} value={form.password}  required/>
        </div>
        <button disabled={loading} className="w-full rounded-xl bg-black p-3 font-medium text-white disabled:opacity-60">{loading?"Creating...":"Register"}</button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="underline" to="/login">
          Login
        </Link>
      </p>
       </div>
    )
}

export default Register;