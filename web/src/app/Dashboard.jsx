import { useParams } from "react-router-dom";
import Projects from "./Projects";
import projectsdata from "@/json/projectsdata"
import { useState,useEffect } from "react";
import api from "@/lib/api";
import CreateProjectModal from "./createProjectModal";
const Dashboard=()=>{
const workspaceId=localStorage.getItem("opspilot_activeWorkspaceId");
console.log("workspace id is",workspaceId);
const [projects,setProjects]=useState([]);
const[loading, setLoading]=useState(true);
const [showModal,setShowModal]=useState(false);

useEffect(()=>{
    const getProjects=async()=>{
        if(!workspaceId) return; //no workspace is selected

        try {
            const {data}=await api.get(`/api/auth/workspaces/${workspaceId}/projects`);
            setProjects(data.projects || []);
        } catch (error) {
            console.error("Failed to fetch projects",error);
        }
        finally
        {
            setLoading(false)
        }
    };
    getProjects();

},[workspaceId])

const handleProjectCreated=(newProject)=>{
    setProjects((prev)=>[newProject,...prev]);
}
    return(
        <div className="mx-auto w-[min(1300px,92%)] border rounded-xl p-4">
            <div className="flex flex-wrap justify-between m-2 p-3">
            <h1 className="font-semibold">Projects</h1>
            {/* <p>workspaceId:{workspaceId}</p> */}
            <button
            onClick={()=>setShowModal(true)} 
            className="p-4 font-medium text-sm bg-black text-white outline-2 outline-amber-50 rounded-2xl">Create Project</button>
            </div>


            <div className="p-3 m-3 rounded-xl">
                {loading?(<p>Projects Loading</p>):projects.length?(<Projects projects={projects} />):(<p>No projects found</p>)}
            </div>

            {showModal && (<CreateProjectModal workspaceId={workspaceId} onClose={()=>setShowModal(false)} onProjectCreated={handleProjectCreated} />)}
        </div>
    )
}
export default Dashboard;