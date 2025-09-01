import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Switch, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import { getUsers, changeUserStatus } from "services/api";
import { getOpenPosition } from "services/api";

export default function useAuthorsTableData(page, limit) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]); // Backend users
  const [totalPages, setTotalPages] = useState(0);
  const [statusMap, setStatusMap] = useState({}); // Track Active/Inactive
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPositions = useCallback(async () => {
    if (!savedUser.id) return;
    try {
      setLoading(true);
      const res = await getOpenPosition(savedUser.id);
      const fetchedPositions = res?.data?.data || [];
      setPositions(fetchedPositions);
    } catch (err) {
      console.error("Error fetching positions:", err);
    } finally {
      setLoading(false);
    }
  }, [savedUser.id]);

  useEffect(() => {
    fetchPositions(); // first time call

    const interval = setInterval(() => {
      fetchPositions();
    }, 5000); // every 5 sec

    return () => clearInterval(interval); // cleanup on unmount
  }, [fetchPositions]);

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

  //   const rows = positions.map((pos) => ({
  //     contract: (
  //       <MDTypography variant="caption" fontWeight="medium">
  //         {pos.contract}
  //       </MDTypography>
  //     ),
  //     entry: (
  //       <MDTypography variant="caption" fontWeight="medium">
  //         {pos.entry_price}
  //       </MDTypography>
  //     ),
  //     current: (
  //       <MDTypography variant="caption" fontWeight="medium">
  //         {pos.mark_price}
  //       </MDTypography>
  //     ),
  //     unrealised: (
  //       <MDTypography
  //         variant="caption"
  //         fontWeight="medium"
  //         color={Number(pos.unrealised_pnl) >= 0 ? "success" : "error"}
  //       >
  //         {pos.unrealised_pnl}
  //       </MDTypography>
  //     ),
  //     leverage: (
  //       <MDTypography variant="caption" fontWeight="medium">
  //         {pos.cross_leverage_limit}X
  //       </MDTypography>
  //     ),
  //     open: (
  //       <MDTypography variant="caption" fontWeight="medium">
  //         {new Date(pos.open_time * 1000).toLocaleString()}
  //         {/* epoch → readable time */}
  //       </MDTypography>
  //     ),
  //     action: (
  //       <MDTypography variant="caption" fontWeight="medium">
  //         {pos.size}
  //       </MDTypography>
  //     ),
  //   }));

  let rows = [];

  if (positions.length === 0) {
    rows = [
      {
        contract: "",
        entry: "",
        current: "",
        unrealised: (
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            p={3}
            sx={{ gridColumn: "1 / -1", color: "#b5b7c6" }} // पूरी row cover करेगा
          >
            <MDTypography variant="h6" fontWeight="medium" color="#b5b7c6">
              No Open Position
            </MDTypography>
          </MDBox>
        ),
        leverage: "",
        open: "",
        action: "",
      },
    ];
  } else {
    rows = positions.map((pos) => ({
      contract: (
        <MDTypography variant="caption" fontWeight="medium">
          {pos.contract}
        </MDTypography>
      ),
      entry: (
        <MDTypography variant="caption" fontWeight="medium">
          {pos.entry_price}
        </MDTypography>
      ),
      current: (
        <MDTypography variant="caption" fontWeight="medium">
          {pos.mark_price}
        </MDTypography>
      ),
      unrealised: (
        <MDTypography
          variant="caption"
          fontWeight="medium"
          color={Number(pos.unrealised_pnl) >= 0 ? "success" : "error"}
        >
          {pos.unrealised_pnl}
        </MDTypography>
      ),
      leverage: (
        <MDTypography variant="caption" fontWeight="medium">
          {pos.cross_leverage_limit}X
        </MDTypography>
      ),
      open: (
        <MDTypography variant="caption" fontWeight="medium">
          {new Date(pos.open_time * 1000).toLocaleString()}
        </MDTypography>
      ),
      action: (
        <MDTypography variant="caption" fontWeight="medium">
          {pos.size}
        </MDTypography>
      ),
    }));
  }

  return {
    columns: [
      { Header: t("contract"), accessor: "contract", align: "left" },
      { Header: t("entryPrice"), accessor: "entry", align: "left" },
      { Header: t("currentPrice"), accessor: "current", align: "center" },
      { Header: t("unrealisedpnl"), accessor: "unrealised", align: "center" },
      { Header: t("leverage"), accessor: "leverage", align: "center" },
      { Header: t("openTime"), accessor: "open", align: "center" },
      { Header: t("quantity"), accessor: "action", align: "center" },
    ],
    rows,
    totalPages,
    snackbar,
    handleCloseSnackbar,
  };
}
