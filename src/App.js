import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Wallet from "./components/Wallet";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Admin from "./components/Admin";

const App = () => {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar style={{ backgroundColor: 'black' }}>
            <Typography variant="h6" style={{flexGrow: 1}}>
              Infraestrutura WEB3
            </Typography>
            <Wallet/>
          </Toolbar>
        </AppBar>

        <nav>
          <ul>
            <li>
              <Link to="/page1">Debentures</Link>
            </li>
            <li>
              <Link to="/page2">Procuração</Link>
            </li>
            <li>
              <Link to="/page3">Assembleia</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
