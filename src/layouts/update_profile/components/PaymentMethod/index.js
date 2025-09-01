// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import { Snackbar, Alert } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// React + hooks
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// ✅ API service
import { updateProfile } from "services/api";
import { useNavigate } from "react-router-dom";

function ProfileUpdate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ✅ States
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    id: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // ✅ Load initial profile (localStorage ya API se)
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("user")) || {};
    setProfile((prev) => ({ ...prev, ...savedProfile }));
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  // ✅ Simple validation
  const validateForm = () => {
    if (!profile.name.trim()) {
      setSnackbar({ open: true, message: "Name is required", severity: "error" });
      return false;
    }
    if (!profile.email.trim()) {
      setSnackbar({ open: true, message: "Email is required", severity: "error" });
      return false;
    }
    // basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setSnackbar({ open: true, message: "Invalid email format", severity: "error" });
      return false;
    }
    // if (!profile.referralCode.trim()) {
    //   setSnackbar({ open: true, message: "Referral Code is required", severity: "error" });
    //   return false;
    // }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // ✅ API call
      await updateProfile(profile.id, profile);

      // ✅ Local save
      localStorage.setItem("user", JSON.stringify(profile));

      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Profile Update Error:", err);
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    }
  };

  return (
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
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          {t("profileSetting")}
        </MDTypography>

        <Tooltip title={isEditing ? "Done" : "Edit Profile"} placement="top">
          <Icon sx={{ cursor: "pointer" }} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "check" : "edit"}
          </Icon>
        </Tooltip>
      </MDBox>

      {/* Content */}
      <MDBox p={3}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} md={6}>
            <MDInput
              fullWidth
              required
              variant="outlined"
              label={t("name")}
              value={profile.name}
              disabled={!isEditing}
              onChange={(e) => handleChange("name", e.target.value)}
              error={isEditing && !profile.name}
              helperText={isEditing && !profile.name ? t("Name is required") : ""}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <MDInput
              fullWidth
              required
              variant="outlined"
              label={t("email")}
              type="email"
              value={profile.email}
              disabled={!isEditing}
              onChange={(e) => handleChange("email", e.target.value)}
              error={isEditing && !profile.email}
              helperText={isEditing && !profile.email ? t("Email is required") : ""}
            />
          </Grid>

          {/* Referral Code */}
          {/* <Grid item xs={12} md={6}>
            <MDInput
              fullWidth
              required
              variant="outlined"
              label={t("Referral Code")}
              value={profile.referralCode}
              disabled={!isEditing}
              onChange={(e) => handleChange("referralCode", e.target.value)}
              error={isEditing && !profile.referralCode}
              helperText={isEditing && !profile.referralCode ? t("Referral Code is required") : ""}
            />
          </Grid> */}

          {/* Save Button */}
          {isEditing && (
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <MDButton variant="contained" color="info" onClick={handleSave}>
                {t("saveChanges")}
              </MDButton>
            </Grid>
          )}

          {/* Change Password Button */}
          {!isEditing && (
            <Grid item xs={12} display="flex" justifyContent="flex-start">
              <MDButton variant="outlined" onClick={() => navigate("/changePassword")} color="info">
                {t("changePassword")}
              </MDButton>
            </Grid>
          )}
        </Grid>
      </MDBox>
    </Card>
  );
}

export default ProfileUpdate;
