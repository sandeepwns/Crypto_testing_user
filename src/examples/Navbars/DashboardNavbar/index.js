/**
 DashboardNavbar - responsive (mobile: breadcrumb + icons on top row; autoTrading+balance below)
*/

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import LanguageSwitcher from "../Button";
import { useTranslation } from "react-i18next";
import MDBox from "components/MDBox";
import { Switch, FormControl, FormLabel, Box, Typography } from "@mui/material";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { Snackbar, Alert } from "@mui/material";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import AccountMenu from "./accountMenu";
import { getUserById, updateAutoTrading, getUserBalance } from "services/api";
import { useAuth } from "context/authContext";
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

  // transparent navbar logic
  useEffect(() => {
    if (fixedNavbar) setNavbarType("sticky");
    else setNavbarType("static");

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const savedUser =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  // fetch user details once
  useEffect(() => {
    if (!savedUser?.id) return;
    let mounted = true;
    getUserById(savedUser.id)
      .then((res) => {
        if (!mounted) return;
        const data = res.data.data;
        setUser(data);
        if (data?.autoTrading) setAutoTrading(true);
      })
      .catch((err) => console.error("Error fetching user:", err));
    return () => {
      mounted = false;
    };
  }, [savedUser?.id]);

  // balance polling (initial + interval)
  useEffect(() => {
    if (!savedUser?.id) return;
    let interval;
    fetchBalance(savedUser.id);
    interval = setInterval(() => fetchBalance(savedUser.id), 250000);
    return () => clearInterval(interval);
  }, [savedUser?.id]);

  const fetchBalance = async (userId) => {
    try {
      setLoadingBalance(true);
      const res = await getUserBalance(userId);
      setBalance(res.data?.data?.cross_available ?? 0);
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleToggle = async (event) => {
    const checked = event.target.checked;

    if (!userData?.publicKey || !userData?.secretKey) {
      setSnackbar({
        open: true,
        message: "Please add your Public Key and Secret Key first",
        severity: "error",
      });
      setAutoTrading(false);
      setTimeout(() => navigate("/apikey"), 1300);
      return;
    }

    try {
      await updateAutoTrading(userData._id, checked);
      setAutoTrading(checked);
      setSnackbar({
        open: true,
        message: checked ? "Auto Trading Enabled" : "Auto Trading Disabled",
        severity: "success",
      });
    } catch (error) {
      console.error("AutoTrading update failed:", error);
      setSnackbar({ open: true, message: "Failed to update Auto Trading", severity: "error" });
    }
  };

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

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
        {/* -------- TOP ROW: Breadcrumb (left)  + Icons (right) - both mobile & desktop -------- */}
        <MDBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 1,
            // prevent wrapping of main top row so breadcrumb and icons stay in one line
            flexWrap: "nowrap",
          }}
        >
          {/* Breadcrumb (left) */}
          <MDBox
            color="inherit"
            sx={(theme) => navbarRow(theme, { isMini })}
            flex={{ xs: "1 1 auto", md: "0 0 auto" }}
          >
            <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          </MDBox>

          {/* Right icons container (always visible on top row) */}
          <MDBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1, md: 1.5 },
              flexShrink: 0,
              // allow horizontal scroll on very small mobile screens instead of wrapping
              overflowX: { xs: "auto", md: "visible" },
              // hide scrollbar visually but keep scroll ability
              "::-webkit-scrollbar": { height: 6 },
            }}
          >
            {/* On desktop we keep AutoTrading + Balance here; on mobile they will be moved to bottom row */}
            {/* AutoTrading - desktop only */}
            {role === "user" && (
              <FormControl
                component="fieldset"
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  flexDirection: "row",
                  whiteSpace: "nowrap",
                }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#9ea2b5 !important",
                    mr: 1,
                  }}
                >
                  {t("autoTrading")}
                </FormLabel>

                <Box display="flex" alignItems="center" gap={0.5}>
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
                    sx={{ "& .MuiSwitch-thumb": { width: 16, height: 16 } }}
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

            {/* Balance - desktop only */}
            {role === "user" && (
              <MDBox
                px={2}
                py={0.8}
                borderRadius="8px"
                bgcolor="#ffffff"
                border="1px solid #e0e0e0"
                display={{ xs: "none", md: "flex" }}
                alignItems="center"
                gap={1}
                flexShrink={0}
                whiteSpace="nowrap"
              >
                <Icon color="action" fontSize="small">
                  account_balance_wallet
                </Icon>
                <MDTypography variant="body2" sx={{ fontWeight: 400, color: "#abb0bf" }}>
                  {loadingBalance
                    ? "Loading..."
                    : `${t("balance")}: $${Number(balance ?? 0).toFixed(2)}`}
                </MDTypography>
              </MDBox>
            )}

            {/* Account menu (avatar / profile menu) */}
            <AccountMenu light={light} darkMode={darkMode} iconsStyle={iconsStyle} />

            {/* Hamburger / mini sidenav */}
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

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              aria-controls="notification-menu"
              aria-haspopup="true"
              onClick={handleOpenMenu}
            >
              <Icon sx={iconsStyle}>notifications</Icon>
            </IconButton>
            {renderMenu()}
          </MDBox>
        </MDBox>

        {/* -------- BOTTOM ROW (MOBILE ONLY): AutoTrading + Balance -------- */}
        {role === "user" && (
          <MDBox
            sx={{
              display: { xs: "flex", md: "none" }, // mobile only
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
              mt: 1,
            }}
          >
            {/* AutoTrading - mobile */}
            <FormControl
              component="fieldset"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                whiteSpace: "nowrap",
              }}
            >
              <FormLabel
                component="legend"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#9ea2b5 !important",
                  mr: 1,
                }}
              >
                {t("autoTrading")}
              </FormLabel>

              <Box display="flex" alignItems="center" gap={0.5}>
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
                  sx={{ "& .MuiSwitch-thumb": { width: 16, height: 16 } }}
                />

                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#9ea2b5" }}
                >
                  {t("on")}
                </Typography>
              </Box>
            </FormControl>

            {/* Balance - mobile */}
            <MDBox
              px={2}
              py={0.8}
              borderRadius="8px"
              bgcolor="#ffffff"
              border="1px solid #e0e0e0"
              display="flex"
              alignItems="center"
              gap={1}
              flexShrink={0}
              whiteSpace="nowrap"
            >
              <Icon color="action" fontSize="small">
                account_balance_wallet
              </Icon>
              <MDTypography variant="body2" sx={{ fontWeight: 400, color: "#abb0bf" }}>
                {loadingBalance
                  ? "Loading..."
                  : `${t("balance")}: $${Number(balance ?? 0).toFixed(2)}`}
              </MDTypography>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  user: null,
};

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
