/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim
Coded by www.creative-tim.com
=========================================================
*/

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton, InputAdornment, Snackbar, Alert } from "@mui/material";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useTranslation } from "react-i18next";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import logo from "assets/images/Dream-logo.jpeg";

// Services & Context
import { login } from "services/api";
import { useAuth } from "context/authContext";

function Basic() {
  const { setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // 🔹 Field validation (with i18n messages)
  const validateField = (field, value) => {
    switch (field) {
      case "email":
        if (!value.trim()) return t("validation.email");
        return /\S+@\S+\.\S+/.test(value) ? "" : t("validation.email");
      case "password":
        if (!value.trim()) return t("validation.Passwordr");
      default:
        return "";
    }
  };

  // 🔹 OnChange handlers
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateField("email", value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validateField("password", value));
  };

  // 🔹 Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError(validateField("email", email));
    setPasswordError(validateField("password", password));
    setServerError("");

    if (emailError || passwordError) return;

    try {
      setLoading(true);
      const res = await login({ email, password });
      const role = res.data.user.role;

      if (res.data.user.status === "Inactive") {
        setServerError(t("InactiveMessage"));
        return;
      }

      if (role !== "user") {
        setServerError(t("validation.onlyUserAllowed"));
        return;
      }

      // Save user & token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role || "User");
      setUser(res.data.user);

      setSnackbar({
        open: true,
        message: "Login Successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: t("validation.invalidCredentials"),
        severity: "error",
      });
      setServerError(err.response?.data?.message || t("validation.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        {/* 🔹 Snackbar */}
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

        {/* 🔹 Header with Logo */}
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDBox display="flex" justifyContent="center" mb={1}>
            <img src={logo} alt="DreamGate Logo" style={{ height: "50px", borderRadius: "8px" }} />
          </MDBox>
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            {t("dreamGateSignIn")}
          </MDTypography>
        </MDBox>

        {/* 🔹 Form */}
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            {/* Email */}
            <MDBox mb={2}>
              <MDInput
                type="email"
                label={t("email")}
                fullWidth
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <MDTypography variant="caption" color="error">
                  {emailError}
                </MDTypography>
              )}
            </MDBox>

            {/* Password */}
            <MDBox mb={2}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label={t("password")}
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <IconEyeOff stroke={1.25} /> : <IconEye stroke={1.25} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {passwordError && (
                <MDTypography variant="caption" color="error">
                  {passwordError}
                </MDTypography>
              )}
            </MDBox>

            {/* Server error */}
            {serverError && (
              <MDTypography variant="button" color="error" sx={{ fontSize: "0.9rem" }}>
                {serverError}
              </MDTypography>
            )}

            {/* Remember me */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;{t("rememberMe")}
              </MDTypography>
            </MDBox>

            {/* Submit */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : t("signIn")}
              </MDButton>
            </MDBox>

            {/* SignUp link */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                {t("dontHaveAccount")}{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  {t("signUp")}
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
