import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Wallet from "./components/Wallet";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Admin from "./components/Admin";

const App = () => {
  const [address, setAddress] = useState("");
  const adminWallet = "0x595dE3E08b9828cb768Fe6E0b694E8FDB004264A"; // Substitua pelo endereço real da carteira do administrador

  // Supondo que o componente Wallet tenha um prop "onAddressChange" que é chamado com o novo endereço sempre que o endereço da carteira muda.
  const handleAddressChange = newAddress => setAddress(newAddress);

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar style={{ backgroundColor: 'black' }}>
            <Typography variant="h6" style={{flexGrow: 1}}>
              Infraestrutura WEB3
            </Typography>
            <Wallet onAddressChange={handleAddressChange}/>
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
            {address === adminWallet && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/admin" element={address === adminWallet ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
