/* @jsxImportSource theme-ui */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeUIProvider } from "theme-ui";
import { theme } from "./theme/theme"

import Awards from "./pages/Awards" 
import Contact from "./pages/Contact" 
import Earth from "./pages/Earth" 
import Papers from "./pages/Papers"
import Press from "./pages/Press"
import Space from "./pages/Space"
import Updates from "./pages/Updates"  
import Homepage from "./pages/Homepage" 
import ContentItem from "./pages/ContentItem"
import PageNotFound from './pages/PageNotFound'

import Navbar from './components/Navbar';

const appSx = {
  width: "67%",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  marginTop: "0em",
  minHeight: "-webkit-fill-available",

  "@media (max-width: 835px)": {
    width: "85%",
  },
};

const containerSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',  // Horizontally centers the child elements
  justifyContent: 'flex-start', // Optional, aligns children vertically to the start. You can also use 'center' to center them vertically.
  width: '100%', // This ensures that the container takes up the full width of its parent
};




function App() {
  return (
    <ThemeUIProvider theme={theme}>
        <BrowserRouter>
          <div sx={containerSx}>
              <Navbar/>
              <div className="mainContent" sx={appSx}>
                <Routes>
                  <Route element={<Homepage />} path="/" exact />
                  <Route element={<Space />} path="/space" exact />
                  <Route element={<Earth />} path="/earth" exact />
                  <Route element={<Papers />} path="/papers" exact />
                  <Route element={<Awards />} path="/awards" exact />
                  <Route element={<Press />} path="/press" exact />
                  <Route element={<Contact />} path="/contact" exact />
                  <Route element={<ContentItem />} path="/content/:slug" />
                  <Route element={<PageNotFound />} path="*" />
                </Routes>
              </div>
          </div>
        </BrowserRouter>
    </ThemeUIProvider>
  );
}

export default App;
