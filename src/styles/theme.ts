import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7c3aed",
      light: "#a78bfa",
      dark: "#5b21b6",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    error: {
      main: "#ef4444",
      light: "#fca5a5",
      dark: "#b91c1c",
    },
    warning: {
      main: "#f59e0b",
      light: "#fcd34d",
      dark: "#d97706",
    },
    info: {
      main: "#0ea5e9",
      light: "#7dd3fc",
      dark: "#0284c7",
    },
    success: {
      main: "#10b981",
      light: "#6ee7b7",
      dark: "#059669",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "currentColor",
            },
            "& fieldset": {
              borderColor: "#e2e8f0",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
          },
          transition: "box-shadow 0.2s",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            backgroundColor: "#f8fafc",
            color: "#1e293b",
            borderBottom: "2px solid #e2e8f0",
          },
          "& .MuiTableCell-root": {
            borderColor: "#e2e8f0",
            padding: "12px 16px",
          },
          "& .MuiTableRow-root:hover": {
            backgroundColor: "#f1f5f9",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          "& .MuiListItemIcon-root": {
            color: "#64748b",
            minWidth: 40,
          },
          "& .MuiListItemText-root": {
            color: "#f8fafc",
          },
          "& .MuiListItemButton-root": {
            borderRadius: 8,
            margin: "4px 8px",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#334155",
            },
            "&.Mui-selected": {
              backgroundColor: "#2563eb",
              "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                color: "#ffffff",
              },
            },
          },
          "& .MuiDivider-root": {
            borderColor: "#334155",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1e293b",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          "& .MuiIconButton-root": {
            color: "#64748b",
            "&:hover": {
              backgroundColor: "#f1f5f9",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "#64748b",
        },
        select: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});
