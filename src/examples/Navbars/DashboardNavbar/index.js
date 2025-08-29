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

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import LanguageSwitcher from "../Button";
import { useTranslation } from "react-i18next";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { Switch, FormControl, FormLabel, Box, Typography } from "@mui/material";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { Snackbar, Alert } from "@mui/material";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import AccountMenu from "./accountMenu";
import { getUserById, updateAutoTrading } from "services/api";
import { useAuth } from "context/authContext";

function DashboardNavbar({ absolute, light, isMini }) {
  const { user } = useAuth();
  const [navbarType, setNavbarType] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userData, setUser] = useState(null);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [autoTrading, setAutoTrading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const route = useLocation().pathname.split("/").slice(1);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    getUserById(savedUser.id)
      .then((res) => {
        const data = res.data.data;
        setUser(data);

        // Agar publicKey aur secretKey dono exist karte hain
        if (data?.autoTrading) {
          setAutoTrading(true);
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [savedUser.id]);

  const handleToggle = async (event) => {
    const checked = event.target.checked;

    if (!userData?.publicKey || !userData?.secretKey) {
      setSnackbar({
        open: true,
        message: "Please add your Public Key and Secret Key first",
        severity: "error",
      });
      setAutoTrading(false); // toggle ko wapas OFF karo
      setTimeout(() => {
        navigate("/apikey");
      }, 3000);

      return;
    }

    try {
      // API call to update autoTrading in backend
      await updateAutoTrading(userData._id, checked);

      // If API call successful, update local state
      setAutoTrading(checked);

      setSnackbar({
        open: true,
        message: checked ? "Auto Trading Enabled" : "Auto Trading Disabled",
        severity: "success",
      });
    } catch (error) {
      console.error("AutoTrading update failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to update Auto Trading",
        severity: "error",
      });
    }
  };

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          // <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
          //   {/* <MDBox pr={1}>
          //     <MDInput label={t("SearchHere")} />
          //   </MDBox> */}
          //   <FormControl component="fieldset" sx={{ display: "flex", alignItems: "center" }}>
          //     {/* Label upar */}
          //     <FormLabel component="legend" sx={{ mb: 1, fontSize: "14px", fontWeight: 600 }}>
          //       Auto Trading
          //     </FormLabel>

          //     {/* Switch with Yes / No */}
          //     <Box display="flex" alignItems="center" gap={1}>
          //       {/* Left side - No */}
          //       <Typography
          //         variant="body2"
          //         sx={{ fontSize: "14px", fontWeight: !autoTrading ? 600 : 400 }}
          //         color={autoTrading ? "text.secondary" : "primary"}
          //       >
          //         No
          //       </Typography>

          //       {/* Toggle Switch - small size */}
          //       <Switch
          //         checked={autoTrading}
          //         onChange={handleToggle}
          //         color="primary"
          //         size="small"
          //       />

          //       {/* Right side - Yes */}
          //       <Typography
          //         variant="body2"
          //         sx={{ fontSize: "14px", fontWeight: autoTrading ? 600 : 400 }}
          //         color={autoTrading ? "primary" : "text.secondary"}
          //       >
          //         Yes
          //       </Typography>
          //     </Box>
          //   </FormControl>
          //   <MDBox
          //     display="flex"
          //     alignItems="center"
          //     justifyContent="center"
          //     gap={1}
          //     color={light ? "white" : "inherit"}
          //   >
          //     {/* <Link>
          //       <IconButton sx={navbarIconButton} size="small" disableRipple>
          //         <Icon sx={iconsStyle}>account_circle</Icon>
          //       </IconButton>
          //     </Link> */}
          //     <AccountMenu light={light} darkMode={darkMode} iconsStyle={iconsStyle} />
          //     <IconButton
          //       size="small"
          //       disableRipple
          //       color="inherit"
          //       sx={navbarMobileMenu}
          //       onClick={handleMiniSidenav}
          //     >
          //       <Icon sx={iconsStyle} fontSize="medium">
          //         {miniSidenav ? "menu_open" : "menu"}
          //       </Icon>
          //     </IconButton>
          //     <LanguageSwitcher />
          //     {/* <IconButton
          //       size="small"
          //       disableRipple
          //       color="inherit"
          //       sx={navbarIconButton}
          //       onClick={handleConfiguratorOpen}
          //     >
          //       <Icon sx={iconsStyle}>settings</Icon>
          //     </IconButton> */}
          //     <IconButton
          //       size="small"
          //       disableRipple
          //       color="inherit"
          //       sx={navbarIconButton}
          //       aria-controls="notification-menu"
          //       aria-haspopup="true"
          //       variant="contained"
          //       onClick={handleOpenMenu}
          //     >
          //       <Icon sx={iconsStyle}>notifications</Icon>
          //     </IconButton>
          //     {renderMenu()}
          //   </MDBox>
          // </MDBox>
          <MDBox
            sx={(theme) => navbarRow(theme, { isMini })}
            display="flex"
            alignItems="center"
            gap={2}
          >
            {/* Auto Trading Toggle */}
            {role === "user" && (
              <FormControl
                component="fieldset"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    textAlign: "center",
                    lineHeight: 1,
                    color: "#9ea2b5 !important",
                    "&.Mui-focused": {
                      color: "#9ea2b5 !important",
                    },
                  }}
                >
                  {t("autoTrading")}
                </FormLabel>

                {/* Switch with Yes / No */}
                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", fontWeight: 500, color: "#9ea2b5" }}
                  >
                    {t("off")}
                  </Typography>

                  <Switch
                    checked={autoTrading}
                    onChange={handleToggle}
                    color="primary"
                    size="small"
                    sx={{
                      mt: "2px",
                      "& .MuiSwitch-thumb": {
                        width: 16,
                        height: 16,
                        marginTop: "2px",
                      },
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", fontWeight: 500, color: "#9ea2b5" }}
                  >
                    {t("on")}
                  </Typography>
                </Box>
              </FormControl>
            )}

            {/* Right side icons aligned center */}
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
              color={light ? "white" : "inherit"}
            >
              <AccountMenu light={light} darkMode={darkMode} iconsStyle={iconsStyle} />
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <LanguageSwitcher />
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {/* {renderMenu()} */}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  user: null,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default DashboardNavbar;
