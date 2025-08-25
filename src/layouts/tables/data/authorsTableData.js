/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { Switch } from "@mui/material";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function data() {
  const { t } = useTranslation();
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );
  const [isActive, setIsActive] = useState(true);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: t("name"), accessor: "author", width: "35%", align: "left" },
      { Header: t("email"), accessor: "email", align: "left" },
      { Header: t("referredBy"), accessor: "status", align: "center" },
      { Header: t("action"), accessor: "action", align: "center" },
    ],

    rows: [
      {
        author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            john@creative-tim.com
          </MDTypography>
        ),
        status: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        action: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={isActive} onChange={handleToggle} color="primary" />
            <MDTypography
              variant="caption"
              color={isActive ? "success" : "error"}
              fontWeight="medium"
            >
              {isActive ? t("active") : t("inactive")}
            </MDTypography>
          </div>
        ),
      },
      {
        author: <Author image={team3} name="Alexa Liras" email="Alexa@creative-tim.com" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Alexa@creative-tim.com
          </MDTypography>
        ),
        status: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        action: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={isActive} onChange={handleToggle} color="primary" />
            <MDTypography
              variant="caption"
              color={isActive ? "success" : "error"}
              fontWeight="medium"
            >
              {isActive ? t("active") : t("inactive")}
            </MDTypography>
          </div>
        ),
      },
      {
        author: <Author image={team4} name="Laurent Perrier" email="Laurent@creative-tim.com" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Laurent@creative-tim.com
          </MDTypography>
        ),
        status: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        action: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={isActive} onChange={handleToggle} color="primary" />
            <MDTypography
              variant="caption"
              color={isActive ? "success" : "error"}
              fontWeight="medium"
            >
              {isActive ? t("active") : t("inactive")}
            </MDTypography>
          </div>
        ),
      },
      {
        author: <Author image={team3} name="Michael Levi" email="Michael@creative-tim.com" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Michael@creative-tim.com
          </MDTypography>
        ),
        status: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        action: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={isActive} onChange={handleToggle} color="primary" />
            <MDTypography
              variant="caption"
              color={isActive ? "success" : "error"}
              fontWeight="medium"
            >
              {isActive ? t("active") : t("inactive")}
            </MDTypography>
          </div>
        ),
      },
      {
        author: <Author image={team3} name="Richard Gran" email="Richard@creative-tim.com" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Richard@creative-tim.com
          </MDTypography>
        ),
        status: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        action: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={isActive} onChange={handleToggle} color="primary" />
            <MDTypography
              variant="caption"
              color={isActive ? "success" : "error"}
              fontWeight="medium"
            >
              {isActive ? t("active") : t("inactive")}
            </MDTypography>
          </div>
        ),
      },
      {
        author: <Author image={team4} name="Miriam Eric" email="Miriam@creative-tim.com" />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Miriam@creative-tim.com
          </MDTypography>
        ),
        status: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Admin
          </MDTypography>
        ),
        action: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch checked={isActive} onChange={handleToggle} color="primary" />
            <MDTypography
              variant="caption"
              color={isActive ? "success" : "error"}
              fontWeight="medium"
            >
              {isActive ? t("active") : t("inactive")}
            </MDTypography>
          </div>
        ),
      },
    ],
  };
}
