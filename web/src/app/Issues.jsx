import api from "@/lib/api";
import { useEffect, useState } from "react";
import IssueTable from "./issueTable";

const Issues = ({ projectId, projectName, workspaceId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await api.get(
          `/api/auth/workspaces/${workspaceId}/projects/${projectId}/issues`
        );
        console.log("data of issues in a selected project is", data.issues);
        setIssues(data.issues || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [projectId, workspaceId]);

  if (loading) return <p>Issues Loading..</p>;

  return (
    <div className="mx-auto  border  rounded-xl p-4 mt-10 mb-10">
      <div className="flex flex-wrap justify-between m-2 p-3">
        <div className="flex flex-col">
          <h1 className="font-semibold">PROJECT ISSUES</h1>
          <p className="text-sm text-gray-600">{projectName}</p>
        </div>
        <button
            onClick={()=>setShowModal(true)} 
            className="p-4 font-medium text-sm bg-black text-white outline-2 outline-amber-50 rounded-2xl">Create Project</button>
      </div>

      <div className="mt-4">
        {issues.length === 0 ? (
        <p className="text-center text-gray-500">No issues found.</p>
        ) : (<IssueTable issues={issues} workspaceId={workspaceId} projectId={projectId} onDelete={(id) =>setIssues((prev) => prev.filter((i) => i._id !== id))} />)}
      </div>
    </div>
  );
};

export default Issues;
