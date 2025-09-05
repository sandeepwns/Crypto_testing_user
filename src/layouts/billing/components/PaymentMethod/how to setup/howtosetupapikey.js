import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import Profile1 from "assets/images/Screen/1_profile_icon.png";
import Profile2 from "assets/images/Screen/2_api_key_managment.png";
import Profile3 from "assets/images/Screen/3_create_api_key_button.png";
import Profile4 from "assets/images/Screen/4_treding_account.png";
import Profile5 from "assets/images/Screen/5_api_key_name.png";
import Profile6 from "assets/images/Screen/6_permission_option.png";
import Profile7 from "assets/images/Screen/7_pairs_coin.png";
import Profile8 from "assets/images/Screen/8_pairs_confirm.png";
import Profile9 from "assets/images/Screen/9_if_show_this_error.png";
import Profile10 from "assets/images/Screen/10_click_security.png";
import Profile11 from "assets/images/Screen/11_google_auth.png";
import Profile12 from "assets/images/Screen/12_fund_password.png";
import Profile13 from "assets/images/Screen/13_final_submit.png";
import Profile14 from "assets/images/Screen/14_agree_model.png";
import Profile15 from "assets/images/Screen/15_securicty_varificetion.png";
import Profile16 from "assets/images/Screen/16_api_key_successfully.png";
import Profile17 from "assets/images/Screen/17_dream_gate_enter_api_key.png";
import Profile18 from "assets/images/Screen/18_api_key_expires_90_days.png";

const highlightStyle = {
  background: "linear-gradient(transparent 40%, #b9ff66 40%)",
  display: "inline-block",
  fontWeight: "bold",
  lineHeight: "1.6",
  padding: "2px 4px",
  borderRadius: "4px",
};

function HowToCreateApiKey() {
  return (
    <Card sx={{ p: 3 }}>
      <MDTypography variant="h5" fontWeight="bold" gutterBottom>
        How to Create Gate.io API Key
      </MDTypography>

      <Grid container spacing={2}>
        {/* Step 1 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              1. Click on the Profile icon.
            </MDTypography>
            <img src={Profile1} alt="Step 1 - Profile Icon" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 2 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              2. Go to <b>Profile → API Management</b>.
            </MDTypography>
            <img src={Profile2} alt="Step 2 - API Management" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 3 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              3. Click on <b>Create API Key</b> button.
            </MDTypography>
            <img src={Profile3} alt="Step 3 - Create API Key" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 4 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              4. Select <b>Trading Account</b>.
            </MDTypography>
            <img src={Profile4} alt="Step 4 - Trading Account" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 5 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              5. Enter your API Key name.
            </MDTypography>
            <img src={Profile5} alt="Step 5 - API Key Name" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 6 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              6. Allow required <b>Permissions</b>.
            </MDTypography>
            <img src={Profile6} alt="Step 6 - Permissions" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 7 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              7. Select trading pairs (e.g., <b>BTC/USDT</b>).
            </MDTypography>
            <img src={Profile7} alt="Step 7 - Select Pairs" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 8 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              8. Click <b>Confirm</b>.
            </MDTypography>
            <img src={Profile8} alt="Step 8 - Confirm" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 9 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              9. If asked, set up your <b>Fund Password</b>.
            </MDTypography>
            <img src={Profile9} alt="Step 9 - Fund Password Setup" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 10 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              10. Go to <b>Profile → Security</b>.
            </MDTypography>
            <img src={Profile10} alt="Step 10 - Security" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 11 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              11. Enable <b>Google Authenticator</b>.
            </MDTypography>
            <img src={Profile11} alt="Step 11 - Google Authenticator" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 12 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              12. Set your <b>Fund Password</b>.
            </MDTypography>
            <img src={Profile12} alt="Step 12 - Set Fund Password" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 13 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              13. Choose this option to create API Key.
            </MDTypography>
            <img src={Profile13} alt="Step 13 - Choose Option" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 14 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              14. Accept <b>API Terms & Conditions</b>.
            </MDTypography>
            <img src={Profile14} alt="Step 14 - Accept Terms" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 15 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              15. Complete <b>Security Verification</b>.
            </MDTypography>
            <img src={Profile15} alt="Step 15 - Security Verification" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 16 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              16. Your <b>Public Key</b> and <b>Secret Key</b> are generated.
            </MDTypography>
            <img src={Profile16} alt="Step 16 - API Keys Generated" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 17 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              17. Enter your Public and Secret Key in Dream Gate.
            </MDTypography>
            <img src={Profile17} alt="Step 17 - Enter Keys in App" style={imgStyle} />
          </MDBox>
        </Grid>

        {/* Step 18 */}
        <Grid item xs={12}>
          <MDBox mb={2}>
            <MDTypography style={highlightStyle} variant="body1">
              18. Your API Key is active (valid for 90 days).
            </MDTypography>
            <img src={Profile18} alt="Step 18 - API Key Active" style={imgStyle} />
          </MDBox>
        </Grid>
      </Grid>
    </Card>
  );
}

const imgStyle = { maxWidth: "100%", borderRadius: "8px", marginTop: "8px" };

export default HowToCreateApiKey;
