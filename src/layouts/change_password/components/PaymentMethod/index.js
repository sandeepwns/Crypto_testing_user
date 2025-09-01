import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useTranslation } from "react-i18next";
import { changePassword } from "services/api";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { IconButton, InputAdornment } from "@mui/material";

export default function ChangePassword() {
  const user = JSON.parse(localStorage.getItem("user")); // user localstorage se
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const { t } = useTranslation();

  // ✅ Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  // 🔹 handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 validate fields
  const validate = () => {
    let tempErrors = {};
    if (!formData.oldPassword) tempErrors.oldPassword = "Old password is required";
    if (!formData.newPassword) tempErrors.newPassword = "New password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 🔹 handle submit
  const handleSubmit = async () => {
    if (!validate()) return; // field validation
    setLoading(true);

    try {
      const res = await changePassword(user.id, formData); // api call
      console.log("response:", res.data);

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: "Password updated successfully!",
          severity: "success",
        });
        // Reset form
        setFormData({ oldPassword: "", newPassword: "" });
      } else {
        setSnackbar({
          open: true,
          message: res.data.error || "Something went wrong!",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("❌ Password Change Error:", err);

      setSnackbar({
        open: true,
        message:
          err.response?.data?.error || // backend ka error (Old password incorrect)
          err.message ||
          "Something went wrong!",
        severity: "error",
      });
    }

    setLoading(false);
  };

  return (
    <MDBox p={3} shadow="sm" borderRadius="lg" bgColor="white">
      <MDTypography variant="h6" fontWeight="medium">
        {t("changePassword")}
      </MDTypography>
      <Grid container mt={0.2} spacing={3}>
        {/* Old Password */}
        <Grid item xs={12} md={6}>
          <MDInput
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            label={t("oldPassword")}
            value={formData.oldPassword}
            onChange={handleChange}
            fullWidth
            required
            helperText={errors.oldPassword}
            sx={{
              "& .MuiFormHelperText-root": {
                color: "red",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                    {showOldPassword ? <IconEyeOff stroke={1.25} /> : <IconEye stroke={1.25} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* New Password */}
        <Grid item xs={12} md={6}>
          <MDInput
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            label={t("newPassword")}
            value={formData.newPassword}
            onChange={handleChange}
            required
            fullWidth
            helperText={errors.newPassword}
            sx={{
              "& .MuiFormHelperText-root": {
                color: "red",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                    {showNewPassword ? <IconEyeOff stroke={1.25} /> : <IconEye stroke={1.25} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <MDButton variant="gradient" color="info" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : t("saveChanges")}
          </MDButton>
        </Grid>
      </Grid>

      {/* ✅ Snackbar */}
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
    </MDBox>
  );
}
