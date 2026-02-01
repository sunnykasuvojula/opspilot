import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between p-3 border">
      <h1 className="text-xl font-bold">OPSPILOT</h1>
      <div className="flex gap-6">
        {["dashboard", "settings"].map((item) => (
          <NavLink
            key={item}
            to={`/app/${item}`}
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-gray-700"
            }
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </NavLink>
        ))}
      </div>

    </nav>
  );
};

export default Navbar;
