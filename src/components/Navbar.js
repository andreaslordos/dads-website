/** @jsxImportSource theme-ui */
import { useLocation, Link } from "react-router-dom";
import { Themed } from "@theme-ui/mdx";
// Modified styles for responsiveness
const navbarSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "3rem 0rem", // Reduced padding for smaller screens
  backgroundColor: "#ffffff",
  position: "sticky",
  top: 0,
  zIndex: 10,
  flexWrap: "wrap", // Allows items to wrap to the next line if there's not enough space
  marginBottom: "1rem",
  width: "80%",

  "@media (max-width: 835px)": {
    borderBottom: "1px solid #ccc",
    width: "100%",
    padding: "0.8rem 0.5rem",
    justifyContent: "center",
    marginBottom: "1rem",
  },
};

const linkSx = {
  textDecoration: "none",
  color: "#333",
  fontWeight: "800",
  fontSize: "1.2rem",
  minWidth: "120px", // This ensures each link has a minimum width and won't break into multiple lines
  textAlign: "center", // Centers text within the link
  "&:hover": {
    color: "#007BFF",
  },
  "&.active": {
    borderBottom: "2px solid #007BFF",
  },
  "@media (max-width: 835px)": {
    minWidth: "10px",
    paddingInline: "10px",
  },
};

export default function Navbar() {
  const location = useLocation();
  const sections = [
    "George Lordos",
    "Space",
    "Papers",
    "Awards",
    "Press",
    "Contact",
  ];

  return (
    <div sx={navbarSx} className="navbar">
      {sections.map((section, index) => {
        // Determine the path for the section
        const path =
          section === "George Lordos"
            ? "/"
            : `/${section.replace(" ", "").toLowerCase()}`;

        return (
          <Link
            key={index}
            to={path}
            sx={linkSx}
            className={location.pathname === path ? "active" : ""}
          >
            <Themed.h3>{section}</Themed.h3>
          </Link>
        );
      })}
    </div>
  );
}
