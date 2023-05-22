import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';



const Wallet = () => {
  const [address, setAddress] = useState("");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({nome: '', email: '', cpf: '', tipo: ''});
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = () => {
    console.log(form);
    handleClose();
  };
  

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      startApp(provider); 
    } else {
      console.log('Por favor, instale MetaMask!');
    }
  }



  const startApp = async (provider) => {
    if (provider !== window.ethereum) {
      console.error('Você tem várias carteiras instaladas?');
    }
    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    setAddress(accounts[0]);
  }

  useEffect(() => {
    connectWallet();
  }, []);


  return (
    <div>
        {!address ? (
          <button onClick={connectWallet}>
            Conectar MetaMask
          </button>
        ) : (
          <p>Conectado com sucesso! Endereço da carteira: {address} 
          
          <p>Necessário realizar credenciamento </p>
          
          <Button style={{ backgroundColor: 'white' }} onClick={handleClickOpen}>
  Credenciar
</Button>

          </p>
          

        )}

<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Credenciamento</DialogTitle>
  <DialogContent>
    <TextField margin="dense" name="nome" label="Nome" type="text" fullWidth value={form.nome} onChange={handleChange} />
    <TextField margin="dense" name="email" label="Email" type="email" fullWidth value={form.email} onChange={handleChange} />
    <TextField margin="dense" name="cpf" label="CPF" type="text" fullWidth value={form.cpf} onChange={handleChange} />
    <FormControl fullWidth margin="dense">
      <InputLabel id="tipo-label">Tipo</InputLabel>
      <Select labelId="tipo-label" name="tipo" value={form.tipo} onChange={handleChange}>
        <MenuItem value="INVESTIDOR">Investidor</MenuItem>
        <MenuItem value="REPRESENTANTE">Representante</MenuItem>
        <MenuItem value="EMISSOR">Emissor</MenuItem>
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancelar
    </Button>
    <Button onClick={handleSubmit} color="primary">
      Confirmar
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
}

export default Wallet;
