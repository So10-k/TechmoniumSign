import { Suspense } from "react";
import { lazyWithRetry } from "../../utils";
import { useTranslation } from "react-i18next";
const DashboardButton = lazyWithRetry(() => import("./DashboardButton"));
const DashboardCard = lazyWithRetry(() => import("./DashboardCard"));
const DashboardReport = lazyWithRetry(() => import("./DashboardReport"));
const buttonList = [
  {
    label: "Sign yourself",
    redirectId: "sHAnZphf69",
    redirectType: "Form",
    icon: "fa-light fa-pen-nib"
  },
  {
    label: "Request signatures",
    redirectId: "8mZzFxbG1z",
    redirectType: "Form",
    icon: "fa-light fa-paper-plane"
  }
];
const GetDashboard = (props) => {
  const { t } = useTranslation();

  const Button = ({ label, redirectId, redirectType, icon }) => (
    <DashboardButton
      Icon={icon}
      Label={label}
      Data={{ Redirect_type: redirectType, Redirect_id: redirectId }}
    />
  );
  const renderSwitchWithTour = (col) => {
    switch (col.widget.type) {
      case "Card":
        return (
          <div
            className="tm-stat-card"
            data-tut={col.widget.data.tourSection}
          >
            <Suspense
              fallback={
                <div className="h-[150px] w-full flex justify-center items-center">
                  {t("loading")}
                </div>
              }
            >
              <DashboardCard
                Icon={col.widget.icon}
                Label={col.widget.label}
                Format={col.widget.format && col.widget.format}
                Data={col.widget.data}
                FilterData={col.widget.filter}
              />
            </Suspense>
          </div>
        );
      case "report": {
        return (
          <div data-tut={col.widget.data.tourSection}>
            <Suspense fallback={<div>please wait</div>}>
              <div className="mb-3 md:mb-0">
                <DashboardReport
                  Record={col.widget}
                />
              </div>
            </Suspense>
          </div>
        );
      }
      default:
        return <></>;
    }
  };
  const renderSwitch = (col) => {
    switch (col.widget.type) {
      case "Card":
        return (
          <div
            className="tm-stat-card"
          >
            <Suspense fallback={<div>please wait</div>}>
              <DashboardCard
                Icon={col.widget.icon}
                Label={col.widget.label}
                Format={col.widget.format && col.widget.format}
                Data={col.widget.data}
                FilterData={col.widget.filter}
              />
            </Suspense>
          </div>
        );
      case "report": {
        return (
          <Suspense fallback={<div>please wait</div>}>
            <div className="mb-3 md:mb-0">
              <DashboardReport
                Record={col.widget}
              />
            </div>
          </Suspense>
        );
      }
      default:
        return <></>;
    }
  };
  return (
    <div className="tm-dashboard">
      <header className="tm-page-heading">
        <div>
          <span className="tm-page-eyebrow">Workspace</span>
          <h1>Documents</h1>
          <p>Prepare an agreement, request signatures, and follow every document through completion.</p>
        </div>
      </header>
      <section className="tm-dashboard-actions" aria-label="Document actions">
        <div
          data-tut={"tourbutton"}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {buttonList.map((btn) => (
            <Button
              key={btn.label}
              label={btn.label}
              redirectType={btn.redirectType}
              redirectId={btn.redirectId}
              icon={btn.icon}
            />
          ))}
        </div>
      </section>
      <div className="tm-dashboard-grid grid grid-cols-12 w-full gap-4">
        {props?.dashboard?.columns?.map((col, i) =>
          col.widget.data && col.widget.data.tourSection ? (
            <div key={i} className={col?.colsize}>
              {renderSwitchWithTour(col)}
            </div>
          ) : (
            <div key={i} className={col?.colsize}>
              {renderSwitch(col)}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GetDashboard;
