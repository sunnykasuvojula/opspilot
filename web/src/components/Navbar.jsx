import { Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, MenuButton, Transition,MenuItems,MenuItem } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("opspilot_activeWorkspaceId");
    localStorage.removeItem("opspilot_membership");
    localStorage.removeItem("opspilot_token");
    localStorage.removeItem("opspilot_user");
    localStorage.removeItem("opspilot_workspace");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-3 border">
      <h1 className="text-xl font-bold">OPSPILOT</h1>

      <div className="flex gap-6 items-center">
        <NavLink
          to="/app/dashboard"
          className={({ isActive }) =>
            isActive ? "font-bold text-blue-600" : "text-gray-700"
          }
        >
          Dashboard
        </NavLink>

        {/* Headless UI Dropdown */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex justify-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Settings ⌄
            </MenuButton>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <NavLink
                      to="/app/Profile"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Profile
                    </NavLink>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-red-600",
                        "block w-full text-left px-4 py-2 text-sm"
                      )}
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
