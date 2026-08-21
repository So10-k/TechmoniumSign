import { useNavigate } from "react-router";
import { openInNewTab } from "../../constant/Utils";
import { useTranslation } from "react-i18next";

const DashboardButton = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  function openReport() {
    if (props.Data && props.Data.Redirect_type) {
      const Redirect_type = props.Data.Redirect_type;
      const id = props.Data.Redirect_id;
      if (Redirect_type === "Form") {
        navigate(`/form/${id}`);
      } else if (Redirect_type === "Report") {
        navigate(`/report/${id}`);
      } else if (Redirect_type === "Url") {
        openInNewTab(id);
      }
    }
  }
  return (
    <button
      type="button"
      onClick={() => openReport()}
      className={`${
        props.Data && props.Data.Redirect_type
          ? "cursor-pointer"
          : "cursor-default"
      } tm-dashboard-action`}
    >
      <span className="tm-dashboard-action-icon">
        <i
          className={`${props.Icon ? props.Icon : "fa-light fa-info"}`}
          aria-hidden="true"
        />
      </span>
      <span className="tm-dashboard-action-copy">
        <strong>{t(`sidebar.${props.Label}`)}</strong>
        {props.Label === "Sign yourself" && (
          <small>{t("signyour-self-button")}</small>
        )}
        {props.Label === "Request signatures" && (
          <small>{t("requestsign-button")}</small>
        )}
      </span>
      <span className="tm-dashboard-action-arrow">
        <i className="fa-light fa-arrow-right" aria-hidden="true" />
      </span>
    </button>
  );
};

export default DashboardButton;
