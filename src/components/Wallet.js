import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Card,Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import abi from '../contracts/abi/1_credenciamento.json'; // Importe o arquivo ABI
import PropTypes from 'prop-types';

const contractAddress_ = '0xF64f1f2FF5D8A9999F4e2c28e8Bce67b57BaD3D7';

const Wallet = ({ onAddressChange }) => {
  const [address, setAddress] = useState("");
  const adminWallet = "0x595dE3E08b9828cb768Fe6E0b694E8FDB004264A";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', tipo_pessoa: '', categoria: '' });
  const [formVerify, SetformVerify] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  async function sendTransaction(form) {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);
    const contractAddress = contractAddress_;
    const contractABI = abi;  // Adicione o ABI do seu contrato aqui

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Aqui vamos chamar a função do seu contrato
    return contract.methods.credenciarPessoa(form.nome, form.email, form.cpf, form.tipo_pessoa, form.categoria).send({ from: window.ethereum.selectedAddress });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setTransactionResult(null);

    try {
      const result = await sendTransaction(form);
      setTransactionResult({
        success: true,
        message: `Transação realizada com sucesso! Número da transação: ${result.transactionHash}`,
      });
      setTimeout(() => {
        setTransactionResult(null);
        window.location.reload();
      }, 3000);
    } catch (error) {
      setTransactionResult({
        success: false,
        message: `Erro ao realizar a transação: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      startApp();
    } else {
      console.log('Por favor, instale MetaMask!');
    }
  }


  // Função para verificar o credenciamento
  async function verificarCredenciamento(address_) {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);
    const contractAddress = contractAddress_;
    const contractABI = abi;  // Adicione o ABI do seu contrato aqui

    const contract = new web3.eth.Contract(contractABI, contractAddress);
console.log("testando com a carteira", address_)
    // Aqui vamos chamar a função do seu contrato
    console.log("testando a função", window.ethereum.selectedAddress)
    return contract.methods.verificarCredenciamento(address_).call();
  }

  const startApp = async () => {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    setAddress(accounts[0]);
    console.log("esse é o endereço" ,address)

    try {
      // Verificar credenciamento
      console.log(address)
      const credenciado = await verificarCredenciamento(address);
      console.log("aqui",credenciado)
      // Se não tiver erro, o endereço é credenciado
      const camposVazios = Object.keys(credenciado).slice(1).every(key => !credenciado[key] || credenciado[key] === "");
      console.log("camposvazios",camposVazios)
      // Se não tiver erro, o endereço é credenciado
      if (credenciado[0] === false && !camposVazios) {
        SetformVerify(true)
        setForm({ aprovado:credenciado[0].toString(), nome: credenciado[2], email: credenciado[4], cpf: credenciado[3], tipo_pessoa: credenciado[1], categoria: credenciado[5] });
      }
      if (credenciado[0] === true && !camposVazios) {
        SetformVerify(true)
        setForm({ aprovado:credenciado[0].toString(), nome: credenciado[2], email: credenciado[4], cpf: credenciado[3], tipo_pessoa: credenciado[1], categoria: credenciado[5] });
      }
    } catch (error) {
      // Se tiver erro, o endereço não é credenciado
      SetformVerify(false)
      console.log(error, 'Endereço não credenciado.');
    }

    // Quando o endereço da carteira muda, chame onAddressChange.
    if (typeof onAddressChange === 'function') {
      onAddressChange(accounts[0]);
    }
  }




  useEffect(() => {
    connectWallet();
    
  }, [address]);


  return (
    <div>
      {!address ? (
        <button onClick={connectWallet}>
          Conectar MetaMask
        </button>
      ) : (
        <>
          <p>Conectado com sucesso! Endereço da carteira: {address}</p>

          {address === adminWallet ? (
            <p>Bem vindo ADMIN!</p>
          ) : formVerify ? (
            <>
                        <Card variant="outlined" style={{ backgroundColor: 'gray', marginLeft: 20, boxShadow: '0px 0px 15px 5px rgba(0, 0, 0, 0.25)', border: '1px solid black' }}>

                        <p><strong>Aprovação: </strong>{form.aprovado}</p>
              <p><strong>Nome: </strong>{form.nome}
              <strong>        Email: </strong> {form.email}
              <strong>        CPF: </strong> {form.cpf}</p>
              <p><strong>Tipo de pessoa: </strong> {form.tipo_pessoa}
              <strong>        Categoria: </strong> {form.categoria}</p>

              </Card>
            </>
          ) : (
            <>
              <p>Necessário realizar credenciamento </p>
              <Button style={{ backgroundColor: 'white' }} onClick={handleClickOpen}>
                Credenciar
              </Button>
            </>
          )}

        </>
      )}

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Credenciamento</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="nome" label="Nome" type="text" fullWidth value={form.nome} onChange={handleChange} />
          <TextField margin="dense" name="email" label="Email" type="email" fullWidth value={form.email} onChange={handleChange} />
          <TextField margin="dense" name="cpf" label="CPF" type="text" fullWidth value={form.cpf} onChange={handleChange} />
          <FormControl fullWidth margin="dense">
            <InputLabel id="tipo-label">Tipo</InputLabel>
            <Select labelId="tipo-label" name="tipo_pessoa" value={form.tipo_pessoa} onChange={handleChange}>
              <MenuItem value="PF">Pessoa Física</MenuItem>
              <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="categoria-label">Categoria</InputLabel>
            <Select labelId="categoria-label" name="categoria" value={form.categoria} onChange={handleChange}>
              <MenuItem value="REPRESENTANTE">Representante</MenuItem>
              <MenuItem value="AGENTE_FIDUCIARIO">Agente Fiduciário</MenuItem>
              <MenuItem value="INVESTIDOR">Investidor</MenuItem>
              <MenuItem value="EMISSOR">Emissor</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          {isLoading ? <p>Enviando transação...</p> : null}
          {transactionResult ? <p>{transactionResult.message}</p> : null}
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


Wallet.propTypes = {
  onAddressChange: PropTypes.func
}
export default Wallet;
