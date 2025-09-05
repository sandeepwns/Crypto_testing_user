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
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { IconButton, InputAdornment, Snackbar, Alert, CircularProgress } from "@mui/material";
import logo from "assets/images/Dream-logo.jpeg";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useTranslation } from "react-i18next";
import { adminLogin } from "services/api";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🔹 Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // 🔹 Common Validation
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

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation again on submit
    const emailErr = validateField("email", email);
    const passwordErr = validateField("password", password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    try {
      setLoading(true);
      setServerError("");

      const res = await adminLogin({ email, password });
      const { token, user, code } = res?.data;

      // Role check
      if (user.role !== "admin") {
        setServerError("Only admins are allowed to login here.");
        return;
      }

      // ✅ Save token + user
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("referralCode", code);

      setSnackbar({
        open: true,
        message: "Login Successfully",
        severity: "success",
      });

      // Redirect
      setTimeout(() => {
        console.log("Hllo shyamm");
        navigate("/dashboard/admin");
        console.log("Hllo shyamm44");
      }, 2000);
    } catch (err) {
      console.log("Error:", err);
      setSnackbar({
        open: true,
        message: "Invalid credentials. Try again.",
        severity: "error",
      });
      setServerError(err.response?.data?.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        {/* Snackbar */}
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

        {/* Header */}
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
            {t("dreamGateAdminSignIn")}
          </MDTypography>
        </MDBox>

        {/* Form */}
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
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

            {/* Server Error */}
            {serverError && (
              <MDTypography variant="button" color="error" sx={{ fontSize: "0.9rem" }}>
                {serverError}
              </MDTypography>
            )}

            {/* Submit Button */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : t("signIn")}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
