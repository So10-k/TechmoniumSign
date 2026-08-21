import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

const Menu = ({ item, isOpen, closeSidebar }) => {
  const appName =
    "techmoniumsign";
  const drivename = appName === "techmoniumsign" ? "techmoniumsign" : "";
  const { t } = useTranslation();
  const { selectedMenu } = useSelector((state) => state.sidebar);

  return (
    <li key={item.title} role="none" className="my-0.5">
      <NavLink
        to={
          item.pageType
            ? `/${item.pageType}/${item.objectId}`
            : `/${item.objectId}`
        }
        className={({ isActive }) =>
          `${isActive && selectedMenu ? "tm-nav-item-active" : ""} tm-nav-item`
        }
        onClick={() => closeSidebar(item.title)}
        tabIndex={isOpen ? 0 : -1}
        role="menuitem"
      >
        <span className="tm-nav-icon">
          <i className={item.icon} aria-hidden="true"></i>
        </span>
        <span>
          {t(`sidebar.${item.title}`, { appName: drivename })}
        </span>
      </NavLink>
    </li>
  );
};

export default Menu;
