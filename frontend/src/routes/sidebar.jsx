/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import KeyIcon from "@heroicons/react/24/outline/KeyIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import WifiIcon from "@heroicons/react/24/outline/WifiIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

export const userRoutes = [
  {
    path: "/app/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "", //no url needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />, // icon component
    name: "Settings", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/settings-profile", //url
        icon: <UserIcon className={submenuIconClasses} />, // icon component
        name: "Profile", // name that appear in Sidebar
      },
      {
        path: "/app/settings-pin", //url
        icon: <KeyIcon className={iconClasses} />, // icon component
        name: "Change PIN", // name that appear in Sidebar
      },
    ],
  },
];

export const adminRoutes = [
  {
    path: "/app/admin",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/app/admin/users",
    icon: <UsersIcon className={iconClasses} />,
    name: "Users",
  },
];
