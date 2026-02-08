import api from "@/lib/api";
import { useState } from "react";
const CreateIssueModal=({workspaceId, projectId, onClose, onIssueCreated})=>{
    const[error,setError]=useState("");
    const[loading,setLoading]=useState(false);
    const [form,setForm]=useState({
        title:"",
        description:"",
        bug:"",
        status:"",
        priority:"",
        asignee:""  
    });

    const handleChange=(e)=>{
        setForm((prev)=>({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        for (const key in form) {
            if (!form[key]) {
              setError(`${key} is required`);
              return;
            }
          }
        setError("");
        setLoading(true);
        try{
            const {data}=await api.post(`/api/auth/workspaces/${workspaceId}/projects/${projectId}/issues`,form);
            onIssueCreated(data.issue);
            console.log(data.issue);
            onClose();
        }
        catch(error)
        {
            setError(error.response?.data?.message || "Failed to create issue");
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Project</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="title"
                        placeholder="Issue Title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Issue Description"
                        className="w-full p-2 border rounded"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="bug"
                        placeholder="Bug Type"
                        className="w-full p-2 border rounded"
                        value={form.bug}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="status"
                        placeholder="Status"
                        className="w-full p-2 border rounded"
                        value={form.status}
                        onChange={handleChange}
                        required
                    />
                    <input type="text" 
                        name="priority"
                        placeholder="priority"
                        className="w-full p-2 border rounded"   
                        value={form.priority}
                        onChange={handleChange}
                        required
                    />
                    <input type="text" 
                        name="asignee"
                        placeholder="asignee"
                        className="w-full p-2 border rounded"   
                        value={form.asignee}
                        onChange={handleChange}
                        required
                    />                   
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded border"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded bg-black text-white"
                        >
                        {loading?"Creating...":"Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default CreateIssueModal;