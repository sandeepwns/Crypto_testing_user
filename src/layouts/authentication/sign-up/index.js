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

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

// @mui material components
import Card from "@mui/material/Card";
import { Snackbar, Alert } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { IconButton, InputAdornment } from "@mui/material";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { signup } from "services/api";
import logo from "assets/images/Dream-logo.jpeg";

function Cover() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🔹 Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uid, setUid] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // 🔹 Error States
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [referralCodeError, setReferralCodeError] = useState("");
  const [uidError, setUidError] = useState("");
  const [serverError, setServerError] = useState("");

  // 🔹 Password show/hide
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // 🔹 Validation Messages
  const validationMessages = {
    name: "Full name is required.",
    email: "Enter a valid email address.",
    password: "Password is required. Please create one to continue.",
    confirmPassword: "Re-enter the same password to confirm.",
    referralCode: "Referral code must include both letters and numbers (e.g., ABC123).",
    uid: "Enter your unique ID to proceed.",
  };

  // 🔹 Validate individual field
  const validateField = (field, value) => {
    switch (field) {
      case "name":
        return value.trim() ? "" : t("validation.name");

      case "email":
        if (!value.trim()) return t("validation.email");
        return /\S+@\S+\.\S+/.test(value) ? "" : t("validation.email");

      case "password":
        if (!value.trim()) return t("validation.password");
        return value.length >= 6 ? "" : t("validation.passwordLength");

      case "confirmPassword":
        if (!value.trim()) return t("validation.confirmPassword");
        return value === password ? "" : t("validation.passwordMismatch");

      case "referralCode":
        if (!value.trim()) return t("validation.referralCode");
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/.test(value)
          ? ""
          : t("validation.referralCode");

      case "uid":
        if (!value.trim()) return t("validation.uid");
        return /^\d+$/.test(value) ? "" : t("validation.uidOnlyNumbers");

      default:
        return "";
    }
  };

  // 🔹 Handle Change with validation
  const handleChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        setNameError(validateField("name", value));
        break;
      case "email":
        setEmail(value);
        setEmailError(validateField("email", value));
        break;
      case "password":
        setPassword(value);
        setPasswordError(validateField("password", value));
        setConfirmPasswordError(validateField("confirmPassword", confirmPassword));
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        setConfirmPasswordError(validateField("confirmPassword", value));
        break;
      case "referralCode":
        setReferralCode(value);
        setReferralCodeError(validateField("referralCode", value));
        break;
      case "uid":
        setUid(value);
        setUidError(validateField("uid", value));
        break;
      default:
        break;
    }
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
    const finalNameError = validateField("name", name);
    const finalEmailError = validateField("email", email);
    const finalPasswordError = validateField("password", password);
    const finalConfirmPasswordError = validateField("confirmPassword", confirmPassword);
    const finalReferralCodeError = validateField("referralCode", referralCode);
    const finalUidError = validateField("uid", uid);

    setNameError(finalNameError);
    setEmailError(finalEmailError);
    setPasswordError(finalPasswordError);
    setConfirmPasswordError(finalConfirmPasswordError);
    setReferralCodeError(finalReferralCodeError);
    setUidError(finalUidError);

    if (
      finalNameError ||
      finalEmailError ||
      finalPasswordError ||
      finalConfirmPasswordError ||
      finalReferralCodeError ||
      finalUidError
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await signup({ name, email, password, confirmPassword, referralCode, uid });

      setSnackbar({
        open: true,
        message:
          res.data.message || "Signup successful. Please check your email to verify your account.",
        severity: "success",
      });

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setReferralCode("");
      setUid("");

      // Redirect after success
      // setTimeout(() => {
      //   navigate("/authentication/sign-in");
      // }, 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Signup failed. Try again.",
        severity: "error",
      });
      setServerError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
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

        {/* 🔹 Header */}
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDBox display="flex" justifyContent="center" mb={1}>
            <img src={logo} alt="DreamGate Logo" style={{ height: "50px", borderRadius: "8px" }} />
          </MDBox>
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            {t("signupTitle")}
          </MDTypography>
        </MDBox>

        {/* 🔹 Form */}
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* Name */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label={t("name")}
                variant="standard"
                fullWidth
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {nameError && (
                <MDTypography variant="caption" color="error">
                  {nameError}
                </MDTypography>
              )}
            </MDBox>

            {/* Email */}
            <MDBox mb={2}>
              <MDInput
                label={t("email")}
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
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
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
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

            {/* Confirm Password */}
            <MDBox mb={2}>
              <MDInput
                type={showConfirmPassword ? "text" : "password"}
                label={t("confirmPassword")}
                variant="standard"
                fullWidth
                value={confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <IconEyeOff stroke={1.25} />
                        ) : (
                          <IconEye stroke={1.25} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {confirmPasswordError && (
                <MDTypography variant="caption" color="error">
                  {confirmPasswordError}
                </MDTypography>
              )}
            </MDBox>

            {/* Referral Code */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label={t("referralcode")}
                variant="standard"
                fullWidth
                value={referralCode}
                onChange={(e) => handleChange("referralCode", e.target.value)}
              />
              {referralCodeError && (
                <MDTypography variant="caption" color="error">
                  {referralCodeError}
                </MDTypography>
              )}
            </MDBox>

            {/* UID */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label={t("uid")}
                variant="standard"
                fullWidth
                value={uid}
                onChange={(e) => handleChange("uid", e.target.value)}
              />
              {uidError && (
                <MDTypography variant="caption" color="error">
                  {uidError}
                </MDTypography>
              )}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : t("signUp")}
              </MDButton>
            </MDBox>

            {/* Already have account */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                {t("alreadyHaveAccount")}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  {t("signIn")}
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
