import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export default function SitemarkIcon() {
  return (
    <SvgIcon
      sx={{
        height: 31,
        width: 100,
        mr: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Text-based logo */}
      <text
        x="50%"
        y="50%"
        alignmentBaseline="middle"
        textAnchor="middle"
        fontFamily="'Satisfy', sans-serif" // Stylish font
        fontSize="16"
        fontWeight="bold"
        fill="#1e40af" // Green color
      >
        EduTrack
      </text>
    </SvgIcon>
  );
}
