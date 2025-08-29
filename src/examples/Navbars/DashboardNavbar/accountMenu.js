import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import { navbarIconButton } from "./styles";
import { useTranslation } from "react-i18next";

const AccountMenu = ({ light, darkMode, iconsStyle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const role = localStorage.getItem("role"); // save role before clearing everything

    localStorage.clear(); // ✅ removes ALL keys from localStorage
    handleCloseMenu();

    if (role === "admin") {
      navigate("/authentication/sign-in/admin"); // 👈 admin login page
    } else {
      navigate("/authentication/sign-in"); // 👈 user login page
    }
  };

  // Styles for the navbar icons
  //   const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
  //     color: () => {
  //       let colorValue = light || darkMode ? white.main : dark.main;

  //       if (transparentNavbar && !light) {
  //         colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
  //       }

  //       return colorValue;
  //     },
  //   });

  return (
    <>
      {/* <IconButton onClick={handleOpenMenu} size="small" sx={{ ml: 1 }}>
        <Icon sx={{ fontSize: 28, color: "text.primary" }}>account_circle</Icon>
      </IconButton> */}
      <IconButton sx={navbarIconButton} onClick={handleOpenMenu} size="small" disableRipple>
        <Icon sx={iconsStyle}>account_circle</Icon>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: "12px",
            minWidth: 160,
            p: 0.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} onClick={handleCloseMenu} sx={{ borderRadius: "8px" }}>
          <Icon fontSize="small" sx={{ mr: 1 }}>
            person
          </Icon>
          {t("profile")}
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ borderRadius: "8px", color: "error.main" }}>
          <Icon fontSize="small" sx={{ mr: 1 }}>
            logout
          </Icon>
          {t("logout")}
        </MenuItem>
      </Menu>
    </>
  );
};
AccountMenu.propTypes = {
  light: PropTypes.bool,
  darkMode: PropTypes.bool,
  iconsStyle: PropTypes.any, // function ya object dono ho sakta hai
};

export default AccountMenu;
