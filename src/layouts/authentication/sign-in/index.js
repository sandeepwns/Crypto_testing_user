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

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton, InputAdornment } from "@mui/material";
import logo from "assets/images/Dream-logo.jpeg";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

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
import LanguageSwitcher from "examples/Navbars/Button";
import { login } from "services/api";
import { useAuth } from "context/authContext";
import { Snackbar, Alert } from "@mui/material";

function Basic() {
  const { setUser } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setServerError("");

    let isValid = true;

    // ✅ Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email");
      isValid = false;
    }

    // ✅ Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true); // 👈 Loader start
      const res = await login({ email, password });
      const role = res.data.user.role;

      if (res.data.user.status === "Inactive") {
        setServerError(t("InactiveMessage")); // ✅ t() se translation string milegi
        return; // login stop
      }
      // ❌ Agar role admin hai toh error message dikhao
      if (role !== "user") {
        setServerError("Only users are allowed to login here.");
        return;
      }

      // 🔑 Token save
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      localStorage.setItem("role", res.data.user.role || "User");

      console.log("Login Success:", res.data);
      setSnackbar({
        open: true,
        message: "Login Successfully",
        severity: "success",
      });

      // ✅ Navigate user
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.log("error:", err);
      setSnackbar({
        open: true,
        message: "Invalid email or password",
        severity: "error",
      });
      setServerError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false); // 👈 Loader stop
    }
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <BasicLayout image={bgImage}>
      {/* <LanguageSwitcher/> */}
      <Card>
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
          {/* 🔹 Logo */}
          <MDBox display="flex" justifyContent="center" mb={1}>
            <img src={logo} alt="DreamGate Logo" style={{ height: "50px", borderRadius: "8px" }} />
          </MDBox>
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            {t("dreamGateSignIn")}
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label={t("email")}
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                // required
              />
              {emailError && (
                <MDTypography variant="caption" color="error">
                  {emailError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label={t("password")}
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
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
            {serverError && (
              <MDTypography variant="button" color="error" sx={{ fontSize: "0.9rem" }}>
                {serverError}
              </MDTypography>
            )}
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
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : t("signIn")}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                {/* Don&apos;t have an account?{" "} */}
                {t("dontHaveAccount")}
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
