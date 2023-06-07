import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { Card, Button } from '@material-ui/core';
import abi from '../contracts/abi/1_credenciamento.json'; // Importe o arquivo ABI
import { Grid } from '@material-ui/core';


const contractAddress = "0x07336Db9D7E17b5976E88e48C96c25F613CeB619";
const contractABI = abi; // Adicione aqui o ABI do seu contrato

const Admin = () => {
  const [credenciados, setCredenciados] = useState([]);

  useEffect(() => {
    const fetchCredenciados = async () => {
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const totalPessoas = await contract.methods.totalPessoas().call();

      const promises = Array.from({ length: totalPessoas }, (_, i) =>
        contract.methods.getPessoa(i).call()
      );
      const pessoasCredenciadas = await Promise.all(promises);

      setCredenciados(pessoasCredenciadas);
    };

    fetchCredenciados();
  }, []);

  const handleAprovar = async (index) => {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const address = await contract.methods.pessoas(index).call();

    await contract.methods.aprovarCredenciamento(address).send({ from: window.ethereum.selectedAddress });
  };

  const handleReprovar = async (index) => {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const address = await contract.methods.pessoas(index).call();
    console.log("essa carteira vai ser reprovada ", address)

    await contract.methods.reprovarCredenciamento(address).send({ from: window.ethereum.selectedAddress });
  };

  const handleDescredenciar = async (index) => {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const address = await contract.methods.pessoas(index).call();

    await contract.methods.descredenciarPessoa(address).send({ from: window.ethereum.selectedAddress });
  };

  return (
    <div>
      <h1>Admin</h1>
      <Grid container spacing={3}>

      {credenciados.map((pessoa, index) => (
              <Grid item xs={12} sm={3} md={3} key={index}>
        <Card variant="outlined" style={{backgroundColor:'gray', width: 200, marginBottom:20}} key={index}>
          <p>Aprovado: {pessoa[0] ? 'Sim' : 'Não'}</p>
          <p>Nome: {pessoa[1]}</p>
          <p>Email: {pessoa[2]}</p>
          <p>CPF/CNPJ: {pessoa[3]}</p>
          <p>Tipo de pessoa: {pessoa[4]}</p>
          <p>Categoria: {pessoa[5]}</p>
          {!pessoa[0] ? (
            <Button variant="outlined" style={{backgroundColor:'green'}} onClick={() => handleAprovar(index)}>
              Aprovar
            </Button>
          ) :


            <>
              <Button variant="outlined" style={{backgroundColor:'orange'}} onClick={() => handleReprovar(index)}>
                Reprovar
              </Button>
              <Button variant="outlined" style={{backgroundColor:'red'}} onClick={() => handleDescredenciar(index)}>
                Descredenciar
              </Button>
            </>
          }
        </Card>
        </Grid>
        
)
      )}
      </Grid>
    </div>

  );
}


export default Admin;
