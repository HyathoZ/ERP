import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  AttachMoney,
  LocalShipping,
  Business,
  Work,
  Build,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: <Dashboard />, path: "/" },
  {
    label: "Vendas",
    icon: <ShoppingCart />,
    children: [
      { label: "Pedidos", icon: <ShoppingCart />, path: "/orders" },
      { label: "Clientes", icon: <People />, path: "/customers" },
    ],
  },
  {
    label: "Produtos",
    icon: <Inventory />,
    children: [
      { label: "Catálogo", icon: <Inventory />, path: "/products" },
      { label: "Fornecedores", icon: <Business />, path: "/suppliers" },
    ],
  },
  {
    label: "Financeiro",
    icon: <AttachMoney />,
    children: [
      { label: "Contas", icon: <AttachMoney />, path: "/financial" },
      { label: "Relatórios", icon: <AttachMoney />, path: "/reports" },
    ],
  },
  {
    label: "Serviços",
    icon: <Build />,
    children: [
      { label: "Ordens de Serviço", icon: <Build />, path: "/service-orders" },
      { label: "Funcionários", icon: <Work />, path: "/employees" },
    ],
  },
  { label: "Transportadoras", icon: <LocalShipping />, path: "/carriers" },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

  useEffect(() => {
    const activeParent = menuItems.find((item) => item.children?.some((child) => child.path === location.pathname));
    if (activeParent && !openSubMenus.includes(activeParent.label)) {
      setOpenSubMenus((prev) => [...prev, activeParent.label]);
    }
  }, [location.pathname]);

  const handleClick = (item: MenuItem) => {
    if (item.children) {
      setOpenSubMenus((prev) =>
        prev.includes(item.label) ? prev.filter((i) => i !== item.label) : [...prev, item.label]
      );
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isSelected = item.path === location.pathname;
    const isParentOfSelected = item.children?.some((child) => child.path === location.pathname);
    const isOpen = openSubMenus.includes(item.label);

    return (
      <Box key={item.label}>
        <ListItemButton
          onClick={() => handleClick(item)}
          selected={isSelected || isParentOfSelected}
          sx={{
            pl: depth * 3 + 2,
            py: 1.5,
            borderRadius: isOpen ? "12px 12px 0 0" : "12px",
            backgroundColor: isSelected
              ? "primary.main"
              : isParentOfSelected
              ? "rgba(37, 99, 235, 0.08)"
              : "transparent",
            "&:hover": {
              backgroundColor: isSelected ? "primary.dark" : "rgba(37, 99, 235, 0.08)",
            },
            mx: 1,
            mb: item.children && isOpen ? 0 : 0.5,
            transition: "all 0.2s",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: isSelected ? "common.white" : "inherit",
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            sx={{
              color: isSelected ? "common.white" : "inherit",
              "& .MuiTypography-root": {
                fontWeight: isSelected || isParentOfSelected ? 600 : 400,
              },
            }}
          />
          {item.children && (
            <Box
              component="span"
              sx={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(-180deg)" : "none",
              }}
            >
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}
        </ListItemButton>
        {item.children && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.04)",
                mx: 1,
                mb: 0.5,
                borderRadius: "0 0 12px 12px",
              }}
            >
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? 280 : 73,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isOpen ? 280 : 73,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
          overflowX: "hidden",
          transition: "width 0.2s",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {isOpen && (
          <Typography variant="h6" sx={{ color: "primary.light", fontWeight: 600 }}>
            ERP System
          </Typography>
        )}
        <IconButton onClick={onToggle} sx={{ color: "primary.light" }}>
          <ChevronLeft
            sx={{
              transform: isOpen ? "none" : "rotate(180deg)",
              transition: "transform 0.2s",
            }}
          />
        </IconButton>
      </Box>
      <List component="nav" sx={{ pt: 1 }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
    </Drawer>
  );
}
