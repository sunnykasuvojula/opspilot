const Projects = ({ projects = [] }) => {
    if (!projects.length) return <p>No projects found</p>;
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {projects.map((p) => (
          <div
            key={p.id || p._id}
            className="border p-4 rounded-xl flex flex-col"
          >
            <p className="text-sm text-gray-700 break-words line-clamp-3">
              {p.description}
            </p>
  
            <p className="text-sm text-gray-600 mt-auto">
              Key: {p.key}
            </p>
  
            <div className="flex gap-3 mt-4">
              <button className="flex-1 hover:cursor-pointer hover:bg-gray-600 hover:text-white border rounded-xl bg-yellow-400 p-2 text-sm">
                Edit
              </button>
              <button className="flex-1 hover:cursor-pointer hover:bg-gray-600 hover:text-white border rounded-xl bg-red-500  p-2 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Projects;
  