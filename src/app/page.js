'use client';

import { useState, useEffect } from 'react';
import { Wallet, ethers } from 'ethers';

//Below line no 7 and 8 using for calling the smart contract functions , The Contract address and ABI are stored in env.local 
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractABI = JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI);

export default function Home(){
  const [walltes, setWallets]  = useState([]);
  const [points, setPoints] = useState(0);
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState('');


useEffect(() => {
  if(typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', connectWallet);

  }
}, []);

//Below function is using for connect multiple wallet and get the signer account address
async function  connectWallet() {
    if(typeof window.ethereum !== 'undefined') {
try {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
  const wallet = accounts[0];

  //Below in line no 36 the 'connectWallet' function is calling on the smart contract for the multiple wallet connection
  await contract.connectWallet(wallet);

  //Below in line no 39 the 'getTotalPoints' function is calling on the smart contract to fetch the Total ponits on the connected address
  const totalPoints = await contract.getTotalPoints(wallet);
  setPoints(totalPoints.toNumber());

  setWallets([...walltes, wallet]);
  setStatus('Wallet connected successfully');
} catch (error) {
  console.error(error);
  setStatus('Error connecting wallet');
}
} else{
  setStatus('Metamask is not installed');
}
}

// Below function is using for mint the unique domain, By calling the 'mintDomain' on the smart contract user can mint a unique domain
async function mintDomain(){
  if(typeof window.ethereum !== 'undefined' && domain) {
    if(walltes.length===0){
      setStatus('Please connect first wallet')
      return
    }
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer =  provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
// Below line no 65 the 'mintDomain' function calling on the smart contract by using ethers.js library 
      await contract.mintDomain(domain);
      setStatus(`Domain ${domain} minted successfully`);
    } catch (error){
      console.error(error);
      setStatus('Domain is already minted');
    }
    } else{
      setStatus('Metamask not installed or domain not provided');
    }
}

return (
    <div>
      <h1>Connect Multiple wallet and Mint a Domain</h1>
      <button onClick={connectWallet}>{walltes.length>0?"connected     "+walltes[0]:'connect wallet'}</button>
      <p>Total Points: {points}</p>
      <input
      type="text"
      placeholder="Enter domain(e.g., Metageeks.com)"
      value={domain}
      onChange={(e) => setDomain(e.target.value)}
      />
      <button onClick={mintDomain}>Mint Domain</button>
      <p>Status: {status}</p>
    </div>
 );
}
