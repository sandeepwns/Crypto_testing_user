import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Switch, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getUsers, changeUserStatus } from "services/api";

export default function useAuthorsTableData(page, limit) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]); // Backend users
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false); // 👈 new state
  const [statusMap, setStatusMap] = useState({}); // Track Active/Inactive
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const fetchUsers = async () => {
    setLoading(true); // start spinner
    try {
      const res = await getUsers(page, limit);
      const fetchedUsers = res.data.data || [];
      setUsers(fetchedUsers);
      setTotalPages(res.data.totalPages);

      // Initialize statusMap only for new users
      const map = {};
      fetchedUsers.forEach((u) => {
        map[u._id] = statusMap[u._id] ?? u.status === "Active";
      });
      setStatusMap(map);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false); // stop spinner
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const toggleStatus = async (userId) => {
    const newStatus = statusMap[userId] ? "Inactive" : "Active";
    try {
      await changeUserStatus(userId, newStatus);
      setStatusMap({ ...statusMap, [userId]: !statusMap[userId] });
      setSnackbar({
        open: true,
        message: `User status changed to ${newStatus}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Error changing status:", err);
      setSnackbar({ open: true, message: "Failed to change status", severity: "error" });
    }
  };

  const rows = loading
    ? [
        {
          referredBy: (
            <MDBox display="flex" justifyContent="center" alignItems="center" width="100%" py={2}>
              <CircularProgress size={24} sx={{ color: "#1976d2" }} />
            </MDBox>
          ),
        },
      ]
    : users.map((user) => ({
        author: (
          <MDTypography variant="caption" fontWeight="medium">
            {user.name}
          </MDTypography>
        ),
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.email}
          </MDTypography>
        ),
        referredBy: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.referredByCode ?? "-"}
          </MDTypography>
        ),
        uId: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.uid ?? "-"}
          </MDTypography>
        ),
        action: (
          <MDBox display="flex" alignItems="center" gap={1}>
            <Switch
              checked={statusMap[user._id]}
              onChange={() => toggleStatus(user._id)}
              color="primary"
            />
            <MDTypography
              variant="caption"
              color={statusMap[user._id] ? "success" : "error"}
              fontWeight="medium"
            >
              {statusMap[user._id] ? t("active") : t("inactive")}
            </MDTypography>
          </MDBox>
        ),
      }));

  return {
    columns: [
      { Header: t("name"), accessor: "author", align: "left" },
      { Header: t("email"), accessor: "email", align: "left" },
      { Header: t("referredBy"), accessor: "referredBy", align: "center" },
      { Header: t("uid"), accessor: "uId", align: "center" },
      { Header: t("action"), accessor: "action", align: "center" },
    ],
    rows,
    totalPages,
    snackbar,
    handleCloseSnackbar,
  };
}
