import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useAuthorsTableData from "layouts/tables/data/authorsTableData";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

function Tables() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10; // 10 users per page

  const { columns, rows, totalPages, snackbar, handleCloseSnackbar } = useAuthorsTableData(
    page,
    limit
  );

  const handleChangePage = (_, value) => {
    setPage(value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  {t("userlist")}
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>

              {/* <MDBox display="flex" justifyContent="center" p={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="info"
                />
              </MDBox> */}
              <MDBox
                display="flex"
                justifyContent="center"
                p={2}
                sx={{
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "#fff", // 👈 background white
                  borderTop: "1px solid #e0e0e0", // 👈 line add hogi upar
                  zIndex: 10,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="info"
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Snackbar for success/error messages */}
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

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
