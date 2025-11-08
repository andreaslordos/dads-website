/* @jsxImportSource theme-ui */
import { ThemeUIProvider } from "theme-ui";
import { theme } from "../lib/theme/theme";
import Navbar from "../src/components/Navbar";
import "../lib/theme/global.css";

const containerSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  paddingBottom: "5rem",
};

const appSx = {
  width: "67%",
  display: "flex",
  flexDirection: "column",
  marginTop: "0em",
  minHeight: "-webkit-fill-available",

  iframe: {
    aspectRatio: "16/9",
    width: "100%",
  },

  "@media (max-width: 835px)": {
    width: "85%",
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <ThemeUIProvider theme={theme}>
      <div sx={containerSx}>
        <Navbar />
        <div className="mainContent" sx={appSx}>
          <Component {...pageProps} />
        </div>
      </div>
    </ThemeUIProvider>
  );
}

export default MyApp;
