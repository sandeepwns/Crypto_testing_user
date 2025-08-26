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

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { signup } from "services/api";

function Cover() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🔹 Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agree, setAgree] = useState(false);

  // 🔹 Error States
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [referralCodeError, setReferralCodeError] = useState("");

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");

    let isValid = true;

    // Name Validation
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }

    // Email Validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email");
      isValid = false;
    }

    // Password Validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!referralCode) {
      setReferralCodeError("Referral code is required"); // 👈 agar required hai
      isValid = false;
    } else if (!/^[A-Za-z0-9]{6,}$/.test(referralCode)) {
      setReferralCodeError("Referral code must be at least 6 characters and only letters/numbers");
      isValid = false;
    }

    // Terms & Conditions
    // if (!agree) {
    //   setAgreeError("You must agree to the terms and conditions");
    //   isValid = false;
    // }

    if (!isValid) return;

    // 🔹 API Call
    try {
      const res = await signup({ name, email, password, confirmPassword, referralCode });

      console.log("Signup Success:", res.data);

      // Redirect to login after success
      navigate("/authentication/sign-in");
    } catch (err) {
      setServerError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
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
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            {t("signupTitle")}
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label={t("name")}
                variant="standard"
                fullWidth
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && (
                <MDTypography variant="caption" color="error">
                  {nameError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                // type="email"
                label={t("email")}
                variant="standard"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <MDTypography variant="caption" color="error">
                  {emailError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label={t("password")}
                variant="standard"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <MDTypography variant="caption" color="error">
                  {passwordError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label={t("confirmPassword")}
                variant="standard"
                fullWidth
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPasswordError && (
                <MDTypography variant="caption" color="error">
                  {confirmPasswordError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label={t("referralCode")}
                variant="standard"
                fullWidth
                onChange={(e) => setReferralCode(e.target.value)}
              />
              {referralCodeError && (
                <MDTypography variant="caption" color="error">
                  {referralCodeError}
                </MDTypography>
              )}
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;{t("iAgree")}
                &nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                {t("termsAndConditions")}
              </MDTypography>
            </MDBox>
            {agreeError && (
              <MDTypography variant="caption" color="error">
                {agreeError}
              </MDTypography>
            )} */}

            {/* Server Error */}
            {serverError && (
              <MDTypography variant="button" color="error" sx={{ fontSize: "0.9rem" }}>
                {serverError}
              </MDTypography>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                {t("signUp")}
              </MDButton>
            </MDBox>
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
