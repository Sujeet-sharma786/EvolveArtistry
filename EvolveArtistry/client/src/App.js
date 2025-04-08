import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUp from "./pages/SignUp";

import Login from "./pages/Login";

import Contactus from "./pages/Contactus";

// import Footer from "./Components/footer";
import ShowPotrait from "./pages/Potrait";

import Download from "./pages/Download";

import HomePage from "./pages/Home";

import React from "react";
import Sidebar from "./Components/SideBar";



import PrivateRoute1 from "./pages/privatecomp2";


import  {ThemeProvider,createTheme}  from "@mui/material";

// const auth = localStorage.getItem("user3");
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Sidebar>
            <Routes>
              {/* <Route element={<PrivateRoute />}> */}
              <Route path="/" element={<HomePage />} />

              <Route path="/download" element={<Download />} />

              {/* </Route> */}
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Login" element={<Login />} />

              {
                <Route element={<PrivateRoute1 />}>
                  <Route path="/potrait" element={<ShowPotrait />} />
                  <Route path="/logout" element={<SignUp />} />
                  <Route path="/contactus" element={<Contactus />} />
                </Route>
              }

                
            </Routes>
          </Sidebar>
          {/* <Footer/> */}
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
