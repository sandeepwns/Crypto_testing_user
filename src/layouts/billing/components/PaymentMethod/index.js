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
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAuth } from "context/authContext";
import { updateApiKeys } from "services/api";
import { useNavigate } from "react-router-dom";

function PaymentMethod() {
  const [controller] = useMaterialUIController();
  const { t } = useTranslation();
  const { darkMode } = controller;
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ State for editable fields
  const [publicKey, setPublicKey] = useState("SJHSDU");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [secretKey, setSecretKey] = useState("HDHEA");
  const [isEditingPublic, setIsEditingPublic] = useState(false);
  const [isEditingSecret, setIsEditingSecret] = useState(false);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const id = savedUser.id;
  const handleSave = async () => {
    try {
      const res = await updateApiKeys({ publicKey, secretKey, id });
      console.log("✅ Keys updated:", res.data);
      setSnackbar({
        open: true,
        message: "API Keys updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("❌ Error updating keys:", error);
      setSnackbar({
        open: true,
        message: "Failed to update API keys. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Card id="delete-account">
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
          {t("apikey")}
        </MDTypography>
      </MDBox>

      <MDBox p={2}>
        <Grid container spacing={3}>
          {/* Public Key */}
          <Grid item xs={12} md={6}>
            <MDTypography variant="subtitle2" color="textSecondary" gutterBottom>
              {t("gatePublicKey")}
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
              {isEditingPublic ? (
                <TextField
                  fullWidth
                  size="small"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                />
              ) : (
                <MDTypography variant="h6" fontWeight="medium">
                  **** **** **** {publicKey}
                </MDTypography>
              )}
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title={isEditingPublic ? "Done" : "Edit Public Key"} placement="top">
                  <Icon
                    sx={{ cursor: "pointer" }}
                    fontSize="small"
                    onClick={() => setIsEditingPublic(!isEditingPublic)}
                  >
                    {isEditingPublic ? "check" : "edit"}
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>

          {/* Secret Key */}
          <Grid item xs={12} md={6}>
            <MDTypography variant="subtitle2" color="textSecondary" gutterBottom>
              {t("gateSecretKey")}
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
              {isEditingSecret ? (
                <TextField
                  fullWidth
                  size="small"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              ) : (
                <MDTypography variant="h6" fontWeight="medium">
                  **** **** **** {secretKey}
                </MDTypography>
              )}
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title={isEditingSecret ? "Done" : "Edit Secret Key"} placement="top">
                  <Icon
                    sx={{ cursor: "pointer" }}
                    fontSize="small"
                    onClick={() => setIsEditingSecret(!isEditingSecret)}
                  >
                    {isEditingSecret ? "check" : "edit"}
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

export default PaymentMethod;
