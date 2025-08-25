import { useTranslation } from "react-i18next";
import { FormControl, Select, MenuItem } from "@mui/material";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
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
        placeholder="Language"
        sx={{
          fontSize: "14px",
          "& .MuiSelect-select": {
            py: 1,
            px: 2,
            textAlign: "center",
            background: "#f0f2f5",
            color: "#9185b4",
          },
        }}
      >
        <MenuItem value="en">English</MenuItem>
        {/* <MenuItem value="hi">हिंदी</MenuItem> */}
        <MenuItem value="ko">한국어</MenuItem>
      </Select>
    </FormControl>
  );
}

export default LanguageSwitcher;
