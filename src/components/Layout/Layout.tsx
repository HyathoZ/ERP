import { useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { theme } from "../../styles/theme";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Header onMenuClick={toggleSidebar} />
          <Box
            sx={{
              p: 3,
              flexGrow: 1,
              overflow: "auto",
              backgroundColor: "background.default",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
