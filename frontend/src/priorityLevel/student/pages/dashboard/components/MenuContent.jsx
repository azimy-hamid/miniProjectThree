import * as React from "react";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    children: [
      { id: "overview", label: "Overview", link: "/student/dashboard" },
      { id: "analytics", label: "Analytics", link: "/student/analytics" },
    ],
  },
  {
    id: "subject-management",
    label: "Subject Management",
    children: [
      {
        id: "subject-overview",
        label: "Subject Overview",
        link: "/student/subject-overview",
      },
      {
        id: "view-subject",
        label: "View Subject",
        link: "/student/view-subject",
      },
    ],
  },
];

export default function MenuContent() {
  const navigate = useNavigate();

  const findLinkById = (id, items) => {
    for (const item of items) {
      if (item.id === id) {
        return item.link; // Return the link if the id matches
      }
      if (item.children) {
        const link = findLinkById(id, item.children); // Recursively search in children
        if (link) {
          return link; // Return the found link from children
        }
      }
    }
    return null; // Return null if no link found
  };

  const handleItemClick = (event, itemId) => {
    const link = findLinkById(itemId, SIDEBAR_ITEMS); // Find the link by id
    if (link) {
      navigate(link); // Navigate to the found link
    }
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, padding: 2 }}>
      <RichTreeView
        items={SIDEBAR_ITEMS}
        onItemClick={handleItemClick} // Use the modified click handler
        getItemLabel={(item) => item.label} // Ensure the label is displayed correctly
        getItemId={(item) => item.id} // Ensure each item has a unique ID
      />
    </Box>
  );
}
