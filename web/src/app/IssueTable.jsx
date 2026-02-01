import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import api from "@/lib/api";

const IssueTable = ({ issues, workspaceId, projectId, onDelete }) => {
  const handleDelete=async(issueId)=>{
    console.log("delete clicked ::",issueId);
    await api.delete(`/api/auth/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}`)
    onDelete(issueId);
  }
  const handleEdit=()=>{
    alert("clicked edit")
  }
    return (
      <table className="table-fixed w-full border border-gray-300 mb-8 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Priority</th>
            <th className="border px-2 py-1">Assignee</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id} className="text-xs">
              <td className="border px-2 py-1">{issue.title}</td>
              <td className="border px-2 py-1">{issue.description}</td>
              <td className="border px-2 py-1">{issue.type}</td>
              <td className="border px-2 py-1">{issue.status}</td>
              <td className="border px-2 py-1">{issue.priority}</td>
              <td className="border px-2 py-1">{issue.assigneeId ? issue.assigneeId.name : "Unassigned"}</td>
              <td className="p-4 mx-auto border ">
                <button className="m-1 cursor-pointer" onClick={()=>handleDelete(issue._id)}><MdDelete size={25} color="red" /></button>
                <button className="m-1 cursor-pointer" onClick={handleEdit}><FaEdit size={25} color="green"/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  
  export default IssueTable;
  