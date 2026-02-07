import { useState } from "react";
const CreateIssueModal=({workspaceId, projectId, onClose, onIssueCreated})=>{
    const [title, setTitle]=useState("");
    const[error,setError]=useState("");
    const[description,setDescription]=useState("");
    const[bug,setbugtype]=useState("");
    const[status,setstatusType]=useState("");
    const[priority,setPiority]=useState("");
    const [asignee, setAsignee]=useState("");
    const[loading,setLoading]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        ["title","description","bug","status","priority","asignee"].map((field)=>{
            if(!field)
            return setError(`${field} is required`);
        })
    }
    return(
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Project</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Issue Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Issue Description"
                        className="w-full p-2 border rounded"
                        value={description}
                        onChange={(e)=> setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Bug Type"
                        className="w-full p-2 border rounded"
                        value={bug}
                        onChange={(e)=> setbugtype(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Status"
                        className="w-full p-2 border rounded"
                        value={status}
                        onChange={(e)=> setstatusType(e.target.value)}
                        required
                    />
                    <input type="text" 
                        placeholder="priority"
                        className="w-full p-2 border rounded"   
                        value={priority}
                        onChange={(e)=> setPiority(e.target.value)}
                        required
                    />
                    <input type="text" 
                        placeholder="asignee"
                        className="w-full p-2 border rounded"   
                        value={priority}
                        onChange={(e)=> setAsignee(e.target.value)}
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