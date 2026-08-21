import { useEffect, useState } from "react";
import dp from "../assets/images/dp.png";
import FullScreenButton from "./FullScreenButton";
import ThemeToggle from "./ThemeToggle";
import BrandWordmark from "./BrandWordmark";
import { useNavigate } from "react-router";
import Parse from "parse";
import { useWindowSize } from "../hook/useWindowSize";
import { saveLanguageInLocal } from "../constant/Utils";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/reducers/sidebarReducer";
import { sessionStatus } from "../redux/reducers/userReducer";

const Header = ({ isConsole, setIsLoggingOut }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const username = localStorage.getItem("username") || "";
  const image = localStorage.getItem("profileImg") || dp;
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    if (width && width <= 768) dispatch(toggleSidebar(false));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    closeSidebar();
  };

  const handleLogout = async () => {
    setIsOpen(false);
    setIsLoggingOut(true);
    try {
      await Parse.User.logOut();
    } catch (err) {
      console.log("Err while logging out", err);
    } finally {
      dispatch(sessionStatus(true));
    }

    const appdata = localStorage.getItem("userSettings");
    const applogo = localStorage.getItem("appLogo");
    const defaultmenuid = localStorage.getItem("defaultmenuid");
    const PageLanding = localStorage.getItem("PageLanding");
    const baseUrl = localStorage.getItem("baseUrl");
    const appid = localStorage.getItem("parseAppId");
    const favicon = localStorage.getItem("favicon");

    localStorage.clear();
    saveLanguageInLocal(i18n);
    localStorage.setItem("appLogo", applogo);
    localStorage.setItem("defaultmenuid", defaultmenuid);
    localStorage.setItem("PageLanding", PageLanding);
    localStorage.setItem("userSettings", appdata);
    localStorage.setItem("baseUrl", baseUrl);
    localStorage.setItem("parseAppId", appid);
    localStorage.setItem("favicon", favicon);
    setIsLoggingOut(false);
    navigate("/");
  };

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    const closeMenuOnOutsideClick = event => {
      if (isOpen && !event.target.closest("#profile-menu")) setIsOpen(false);
    };
    document.addEventListener("click", closeMenuOnOutsideClick);
    return () => document.removeEventListener("click", closeMenuOnOutsideClick);
  }, [isOpen]);

  return (
    <div className="op-navbar tm-app-header touch-none">
      <div className="flex items-center gap-3">
        <button
          className="op-btn op-btn-square op-btn-ghost tm-header-icon-button no-animation"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle navigation"
        >
          <i className="fa-light fa-bars" aria-hidden="true" />
        </button>
        <button
          onClick={() => navigate("/dashboard/35KBoSgoAK")}
          className="tm-header-brand"
          aria-label="Go to dashboard"
        >
          <BrandWordmark />
        </button>
      </div>

      <div id="profile-menu" className="tm-header-actions">
        <div className="tm-header-desktop-action">
          <FullScreenButton />
        </div>
        {width >= 768 && (
          <button onClick={toggleDropdown} className="tm-account-trigger">
            <img className="tm-account-avatar" src={image} alt="" />
            <span>{username}</span>
            <i className="fa-light fa-angle-down" aria-hidden="true" />
          </button>
        )}
        <div className="op-dropdown op-dropdown-open op-dropdown-end">
          <button
            type="button"
            onClick={toggleDropdown}
            className="op-btn op-btn-ghost tm-mobile-account-button"
            aria-label="Open account menu"
          >
            <i className="fa-light fa-user" aria-hidden="true" />
          </button>
          <ul
            className={`tm-account-menu op-dropdown-open op-menu op-menu-sm op-dropdown-content ${
              isOpen ? "" : "hidden"
            }`}
          >
            {!isConsole && (
              <>
                <li onClick={() => { setIsOpen(false); navigate("/profile"); }}>
                  <span><i className="fa-light fa-user" /> {t("profile")}</span>
                </li>
                <li onClick={() => { setIsOpen(false); navigate("/changepassword"); }}>
                  <span><i className="fa-light fa-lock" /> {t("change-password")}</span>
                </li>
                <li onClick={() => { setIsOpen(false); navigate("/verify-document"); }}>
                  <span><i className="fa-light fa-check-square" /> {t("verify-document")}</span>
                </li>
                <li>
                  <span><i className="fa-light fa-moon" /> {t("dark-mode")} <ThemeToggle /></span>
                </li>
              </>
            )}
            <li onClick={handleLogout}>
              <span><i className="fa-light fa-arrow-right-from-bracket" /> {t("log-out")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
