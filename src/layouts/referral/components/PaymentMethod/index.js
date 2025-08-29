// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useTranslation } from "react-i18next";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

// ✅ import API service
import { updateReferralCode } from "services/api";

function ReferralCode() {
  const [controller] = useMaterialUIController();
  const { t } = useTranslation();
  const { darkMode } = controller;
  const navigate = useNavigate();

  // ✅ State
  const [referralCode, setReferralCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // ✅ Load from localStorage when component mounts
  useEffect(() => {
    const savedCode = localStorage.getItem("referralCode");
    if (savedCode) {
      setReferralCode(savedCode);
    }
  }, []);

  const handleSave = async () => {
    if (!referralCode.trim()) {
      setSnackbar({
        open: true,
        message: "Referral code cannot be empty.",
        severity: "error",
      });
      return;
    }

    try {
      // ✅ Backend API call
      await updateReferralCode({ code: referralCode });

      // ✅ Save in localStorage
      localStorage.setItem("referralCode", referralCode);

      setSnackbar({
        open: true,
        message: "Referral Code saved successfully!",
        severity: "success",
      });
      // setTimeout(() => {
      //   navigate("/dashboard");
      // }, 3000);
    } catch (error) {
      console.error("❌ Error saving referral code:", error);
      setSnackbar({
        open: true,
        message: "Failed to save Referral Code. Please try again.",
        severity: "error",
      });
    }
  };

  return (
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

      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          {t("Referral Code")}
        </MDTypography>
      </MDBox>

      <MDBox p={2}>
        <Grid container spacing={3}>
          {/* Referral Code */}
          <Grid item xs={12} md={6}>
            <MDTypography variant="subtitle2" color="textSecondary" gutterBottom>
              {t("Your Referral Code")}
            </MDTypography>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              ) : (
                <MDTypography variant="h6" fontWeight="medium">
                  {referralCode || "Not Set"}
                </MDTypography>
              )}

              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title={isEditing ? "Done" : "Edit Referral Code"} placement="top">
                  <Icon
                    sx={{ cursor: "pointer" }}
                    fontSize="small"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "check" : "edit"}
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <MDButton variant="contained" color="info" onClick={handleSave}>
              {t("save")}
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default ReferralCode;
