import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { Button, Dialog, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import abi from '../contracts/abi/2_realdigital.json'; // Importe o arquivo ABI


const CONTRACT_ADDRESS = '0xA81930D108BA4EA432DaFffb6Bd0B9814A39A72F';

const ABI = abi

const RealDigital = () => {
  const [balance, setBalance] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBalanceAndClaimStatus = async () => {
      // Detecta o provedor Ethereum (Metamask, por exemplo)
      const provider = await detectEthereumProvider();

      if (provider) {
        // Cria uma nova instância Web3 usando o provedor
        const web3 = new Web3(provider);

        // Obtém as contas
        const accounts = await web3.eth.getAccounts();

        // Cria uma instância do contrato
        const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

        // Chama as funções do contrato e atualiza o estado do componente
        const balance = await contract.methods.balanceOf(accounts[0]).call();
        const claimed = await contract.methods.hasClaimed(accounts[0]).call();

        // Atualiza o estado do componente
        setBalance(web3.utils.fromWei(String(balance), 'ether'));
        setHasClaimed(claimed);
      } else {
        console.log('Please install MetaMask!');
      }
    }

    fetchBalanceAndClaimStatus();
  }, []);

  const handleClaim = async () => {
    setDialogOpen(true);
    setTransactionError(null);
    setTransactionHash(null);

    const provider = await detectEthereumProvider();

    if (provider) {
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

      try {
        const receipt = await contract.methods.claim().send({ from: accounts[0] });
        setTransactionHash(receipt.transactionHash);
      } catch (error) {
        setTransactionError(error.message);
      }

      const claimed = await contract.methods.hasClaimed(accounts[0]).call();
      setHasClaimed(claimed);

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } else {
      console.log('Please install MetaMask!');
    }
  }

  return (
    <div>
      <h1>Real Digital</h1>
      <Typography variant="body1">Saldo: {balance} Real Digital</Typography>
      <Button
        variant="contained"
        color="primary"
        disabled={hasClaimed}
        onClick={handleClaim}
      >
        {hasClaimed ? 'Resgate já realizado' : 'Resgatar'}
      </Button>
      <h4>Real Digital Token Adress: {CONTRACT_ADDRESS}</h4>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} disableBackdropClick>
        <DialogTitle>Resgate de Real Digital</DialogTitle>
        <DialogContent>
          {transactionError && (
            <Typography variant="body1" color="error">Houve um erro na operação: {transactionError}</Typography>
          )}
          {transactionHash && (
            <Typography variant="body1" color="primary">Real Digital resgatado com sucesso. Hash da transação: {transactionHash}</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RealDigital;