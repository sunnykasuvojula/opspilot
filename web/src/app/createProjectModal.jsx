import { useState } from "react";
import api from "@/lib/api";

const CreateProjectModal=({ workspaceId, onClose, onProjectCreated })=>{
  console.log("workspaceId in createProjectModal is :", workspaceId);
    const[name,setName]=useState("");
    const[key,setKey]=useState("");
    const[description,setDescription]=useState("");
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (!name || !key) return setError("Name and Key are required");
        setError("");
        setLoading(true);

        try {
            const {data}=await api.post(`/api/auth/workspaces/${workspaceId}/projects`,{
                name,
                key,
                description
            });
            console.log("created input data response is :", data);
            onProjectCreated(data.project);
            onClose();
        } catch (error) {
            console.log(error);
            setError(error?.response?.data?.message || "Failed to create project..");
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
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Project Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
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
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}

export default CreateProjectModal;