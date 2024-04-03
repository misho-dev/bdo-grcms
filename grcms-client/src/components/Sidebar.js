import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { Resizable } from "re-resizable";
import MenuIcon from "@mui/icons-material/Menu"; // Placeholder, replace as necessary
import DashboardIcon from "@mui/icons-material/Dashboard"; // Placeholder, replace as necessary
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const menuItems = [
  {
    path: "/organizations",
    name: "Organization Management",
    icon: <DashboardIcon />,
  },
  // Add more items as needed
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(240); // Initial width

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setDrawerWidth(isCollapsed ? 240 : 72); // Adjust widths for collapsed and expanded states
  };

  return (
    <Resizable
      size={{ width: drawerWidth, height: "100vh" }}
      onResizeStop={(e, direction, ref, d) => {
        setDrawerWidth(drawerWidth + d.width);
      }}
      minWidth={72}
      maxWidth={500}
      enable={{ right: true }}
      handleStyles={{
        right: {
          backgroundColor: "transparent",
          padding: "5px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: "width 0.3s ease", // Add transition for smooth resizing
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.3s ease", // Ensure paper transitions smoothly as well
          },
        }}
        variant="permanent"
        anchor="left"
      >
                <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "0px", // Adjust as needed to place correctly outside the drawer
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            borderRadius: "50%",
            padding: "5px",
            zIndex: 1200, // Ensure it's above the drawer
          }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <List>
          {menuItems.map((item, index) => (
           <NavLink to={item.path} key={index} className={({ isActive }) => (isActive ? "Mui-selected" : "")}>
           <ListItem button>
             <ListItemIcon>{item.icon}</ListItemIcon>
             {!isCollapsed && <ListItemText primary={item.name} />}
           </ListItem>
         </NavLink>
          ))}
        </List>
      </Drawer>
    </Resizable>
  );
};

export default Sidebar;
