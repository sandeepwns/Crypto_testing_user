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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";
import { FormControl, Select, MenuItem } from "@mui/material";

// Authentication layout components
import Footer from "layouts/authentication/components/Footer";
import { useTranslation } from "react-i18next";

function CoverLayout({ coverHeight, image, children }) {
  const { i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <PageLayout>
      {/* <DefaultNavbar
        action={{
          type: "external",
          route: "https://creative-tim.com/product/material-dashboard-react",
          label: "free download",
        }}
        transparent
        light
      /> */}
      <MDBox
        width="calc(100% - 2rem)"
        minHeight={coverHeight}
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        pb={28}
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.4),
              rgba(gradients.dark.state, 0.4)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox mt={{ xs: -20, lg: -18 }} px={1} width="calc(100% - 2rem)" mx="auto">
        <MDBox display="flex" justifyContent="flex-end">
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              displayEmpty
              sx={{
                fontSize: "14px",
                "& .MuiSelect-select": {
                  py: 1,
                  px: 2,
                  textAlign: "center",
                  background: "#f0f2f5",
                  color: "#9185b4",
                },
                "& .MuiSelect-icon": {
                  color: "#9185b4", // 👈 arrow icon color change
                  right: 8, // 👈 position adjust
                },
              }}
            >
              <MenuItem value="en">English</MenuItem>
              {/* <MenuItem value="hi">हिंदी</MenuItem> */}
              <MenuItem value="ko">한국어</MenuItem>
            </Select>
          </FormControl>
        </MDBox>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </PageLayout>
  );
}

// Setting default props for the CoverLayout
CoverLayout.defaultProps = {
  coverHeight: "35vh",
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
