import { useEffect, useState } from "react";
import api from "@/lib/api";

const CreateProjectModal = ({
  workspaceId,
  onClose,
  onProjectCreated,
  onProjectUpdated,
  project,
}) => {
  const [form, setForm] = useState({
    name: "",
    key: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 Populate form when editing
  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        key: project.key || "",
        description: project.description || "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.key) {
      return setError("Name and Key are required");
    }

    setError("");
    setLoading(true);

    try {
      if (project) {
        // EDIT
        const { data } = await api.patch(
          `/api/auth/workspaces/${workspaceId}/projects/${project._id}`,
          form
        );
        onProjectUpdated(data.project);
      } else {
        // CREATE
        const { data } = await api.post(
          `/api/auth/workspaces/${workspaceId}/projects`,
          form
        );
        onProjectCreated(data.project);
      }

      onClose();
    } catch (err) {
      console.error("Save failed", err);
      setError("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-3">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            type="text"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="key"
            type="text"
            placeholder="Project Key"
            value={form.key}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {loading
                ? "Saving..."
                : project
                ? "Update Project"
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
