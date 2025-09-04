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
import { getUserBalance } from "services/api";
import MDTypography from "components/MDTypography";

function DashboardNavbar({ absolute, light, isMini }) {
  const { user } = useAuth();
  const [navbarType, setNavbarType] = useState();
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
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

  useEffect(() => {
    let interval;

    if (savedUser?.id) {
      // first time call immediately
      fetchBalance(savedUser.id);

      // then repeat every 10 seconds
      interval = setInterval(() => {
        fetchBalance(savedUser.id);
      }, 250000);
    }

    return () => {
      if (interval) clearInterval(interval); // cleanup
    };
  }, [savedUser?.id]);

  const fetchBalance = async (userId) => {
    try {
      setLoadingBalance(true);
      const res = await getUserBalance(userId); // API call
      console.log("data :", res.data);
      setBalance(res.data?.data?.cross_available || 0);
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setLoadingBalance(false);
    }
  };
  console.log("balance :", balance);

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

        {/* Left side: Breadcrumb */}
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
          flex={{ xs: "1 1 100%", md: "0 0 auto" }}
        >
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>

        {/* Right side: responsive container */}
        {!isMini && (
          <MDBox
            sx={(theme) => navbarRow(theme, { isMini })}
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
            flex={{ xs: "1 1 100%", md: "0 0 auto" }}
          >
            {/* Auto Trading Switch (only for user) */}
            {role === "user" && (
              <FormControl
                component="fieldset"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: { xs: "row", md: "column" },
                }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    textAlign: "center",
                    lineHeight: 1,
                    color: "#9ea2b5 !important",
                    "&.Mui-focused": { color: "#9ea2b5 !important" },
                    mb: { xs: 0, md: 0.5 },
                    mr: { xs: 1, md: 0 },
                  }}
                >
                  {t("autoTrading")}
                </FormLabel>

                <Box display="flex" alignItems="center" gap={0.5} mt={{ xs: 0, md: 0.5 }}>
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
                      "& .MuiSwitch-thumb": { width: 16, height: 16, marginTop: "2px" },
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

            {/* Balance card */}
            {role === "user" && (
              <MDBox
                px={2}
                py={1}
                borderRadius="8px"
                bgcolor="#ffffff"
                border="1px solid #e0e0e0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                flexShrink={0}
              >
                <Icon color="action">account_balance_wallet</Icon>
                <MDTypography variant="body2" sx={{ fontWeight: 400, color: "#abb0bf" }}>
                  {loadingBalance
                    ? "Loading..."
                    : `${t("balance")}: $${Number(balance ?? 0).toFixed(2)}`}
                </MDTypography>
              </MDBox>
            )}

            {/* Right side icons */}
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
              flexWrap="wrap"
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
