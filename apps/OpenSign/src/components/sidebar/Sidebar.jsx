import { useState, useEffect } from "react";
import Menu from "./Menu";
import Submenu from "./SubMenu";
import dp from "../../assets/images/dp.png";
import sidebarList, { subSetting } from "../../json/menuJson";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "../../hook/useWindowSize";
import {
  setSelectedMenu,
  toggleSidebar
} from "../../redux/reducers/sidebarReducer";
import { getSidebarStateClass } from "./sidebarState";

const Sidebar = () => {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [menuList, setmenuList] = useState([]);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const username = localStorage.getItem("username");
  const image = localStorage.getItem("profileImg") || dp;
  const tenantname = localStorage.getItem("Extand_Class")
    ? JSON.parse(localStorage.getItem("Extand_Class"))?.[0]?.Company
    : "";

  useEffect(() => {
    if (localStorage.getItem("accesstoken")) {
      menuItem();
    }
  }, []);

  const closeSidebar = () => {
    dispatch(setSelectedMenu(true));
    if (width <= 1023) {
      dispatch(toggleSidebar(false));
    }
  };

  const menuItem = async () => {
    try {
      if (localStorage.getItem("defaultmenuid")) {
        const Extand_Class = localStorage.getItem("Extand_Class");
        const extClass = Extand_Class && JSON.parse(Extand_Class);
        const userRole = extClass?.[0]?.UserRole || "contracts_User";
        const isAdmin =
          userRole === "contracts_Admin" || userRole === "contracts_OrgAdmin";
        const newSidebarList = sidebarList.map((item) => {
          if (item.title !== "Settings") return item;
          const newItem = { ...item };
          const baseChildren = isAdmin ? subSetting : subSetting?.slice(0, 1);
            const mysignature = newItem.children.slice(0, 1);
            newItem.children = [...mysignature, ...baseChildren];
          return newItem;
        });
        setmenuList(newSidebarList);
      }
    } catch (e) {
      console.error("Problem", e);
    }
  };

  const toggleSubmenu = (title) => {
    dispatch(setSelectedMenu(false));
    setSubmenuOpen({ [title]: !submenuOpen[title] });
  };

  const handleMenuItem = () => {
    dispatch(setSelectedMenu(true));
    closeSidebar();
    setSubmenuOpen({});
  };
  const handleProfile = () => {
    closeSidebar();
    navigate("/profile");
  };
  return (
    <aside
      className={`tm-sidebar ${getSidebarStateClass(isOpen)} absolute max-lg:min-h-screen lg:relative z-[500] hide-scrollbar`}
      data-state={isOpen ? "open" : "closed"}
      aria-hidden={!isOpen}
    >
      <div className="tm-sidebar-workspace">
        <div className="tm-sidebar-workspace-mark" aria-hidden="true">
          {(tenantname || "T").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="tm-sidebar-kicker">Workspace</p>
          <p className="tm-sidebar-workspace-name">{tenantname || "Techmonium"}</p>
        </div>
      </div>
      <nav
        className="tm-sidebar-nav op-menu op-menu-sm"
        aria-label="techmoniumsign sidebar navigation"
      >
        <ul
          className="text-sm"
          role="menubar"
          aria-label="techmoniumsign sidebar navigation"
        >
          {menuList.map((item) =>
            !item.children ? (
              <Menu
                key={item.title}
                item={item}
                isOpen={isOpen}
                closeSidebar={handleMenuItem}
              />
            ) : (
              <Submenu
                key={item.title}
                item={item}
                closeSidebar={closeSidebar}
                toggleSubmenu={toggleSubmenu}
                submenuOpen={submenuOpen}
              />
            )
          )}
        </ul>
      </nav>
      <button className="tm-sidebar-account" onClick={handleProfile}>
        <img src={image} alt="" />
        <span>
          <strong>{username}</strong>
          <small>View profile</small>
        </span>
        <i className="fa-light fa-arrow-up-right" aria-hidden="true" />
      </button>
    </aside>
  );
};

export default Sidebar;
