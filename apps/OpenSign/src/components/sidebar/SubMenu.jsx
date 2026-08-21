import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

const Submenu = ({ item, closeSidebar, toggleSubmenu, submenuOpen }) => {
  const appName =
    "techmoniumsign";
  const drivename = appName === "techmoniumsign" ? "techmoniumsign" : "";
  const { t } = useTranslation();
  const { title, icon, children } = item;
  const { selectedMenu } = useSelector((state) => state.sidebar);

  return (
    <li role="none" className="my-0.5">
      <button
        onClick={() => toggleSubmenu(item.title)}
        className="tm-nav-item"
        aria-expanded={submenuOpen}
        aria-haspopup="true"
        aria-controls={`submenu-${title}`}
      >
        <span className="tm-nav-icon">
          <i className={icon}></i>
        </span>
        <div className="flex justify-between items-center w-full">
          <span className="flex items-center mb-0.5">
            {t(`sidebar.${item.title}`, { appName })}
          </span>
          <i
            className={`${
              submenuOpen[item.title]
                ? "fa-light fa-angle-down"
                : "fa-light fa-angle-right"
            }`}
            aria-hidden="true"
          ></i>
        </div>
      </button>
      {submenuOpen[item.title] && (
        <ul id={`submenu-${title}`} role="menu" aria-label={`${title} submenu`}>
          {children.map((childItem) => (
            <li key={childItem.title} role="none" className="my-0.5">
              <NavLink
                to={
                  childItem.pageType
                    ? `/${childItem.pageType}/${childItem.objectId}`
                    : `/${childItem.objectId}`
                }
                className={({ isActive }) =>
                  `${isActive && selectedMenu ? "tm-nav-item-active" : ""} tm-nav-item tm-nav-child`
                }
                onClick={() => closeSidebar(childItem.title)}
                role="menuitem"
                tabIndex={submenuOpen ? 0 : -1}
              >
                <span className="tm-nav-icon">
                  <i
                    className={childItem.icon}
                    aria-hidden="true"
                  ></i>
                </span>
                <span className="mb-0.5">
                  {t(`sidebar.${item.title}-Children.${childItem.title}`, {
                    appName: drivename
                  })}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Submenu;
