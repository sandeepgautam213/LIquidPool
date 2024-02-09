"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenSwap from "./artifacts/contracts/TokenSwap.sol/TokenSwap.json";
import ERC20 from "./artifacts/contracts/ERC20.sol/ERC_20.json";
import Link from "next/link";
import Form from "./components/Form";
import styles from "./page.module.css";


export default function Home() {
  
  const [token, setToken] = useState({ RBNT: "", SANDY: "" });
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [RBNTContract, setRBNTContract] = useState(null);
  const [SANDYContract, setSANDYContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [reserve, setReserve] = useState({ reserve0: 0, reserve1: 0 });
  const [loading, setLoading] = useState(false);
  const contractAddress = "0x9c5EbdE47DFBEB61658f64f4D732977920C961D1";
  const RBNTAddress = "0xd31F679a3041B9dE4ca1966d78623ED8f0722Dbf";
  const SANDYAddress = "0x96A1B7c8fd02cbf46b21Fb2CfB179ed92187A4A1";

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wallet = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

       
        const contract = new ethers.Contract(
          contractAddress,
          TokenSwap.abi,
          signer
        );

        const rbntContract = new ethers.Contract(
          RBNTAddress,
          ERC20.abi,
          signer
        );
        const sandyContract = new ethers.Contract(
          SANDYAddress,
          ERC20.abi,
          signer
        );
        setContract(contract);
        setRBNTContract(rbntContract);
        setSANDYContract(sandyContract);
        setProvider(signer);
      } else {
        alert("Metamask is not installed.");
      }
    };

    provider && wallet();
  }, []);

  useEffect(() => {
    const reserves = async () => {
      if (contract) {
        try {
          // Wait for the transaction to be confirmed
        //  await provider.waitForTransaction(contract.provider._lastBlockNumber);
  
          // Update the reserves
          const reserve0 = await contract.reserveRBNT();
         // console.log(reserve0);
          const reserve1 = await contract.reserveSANDY();
         // console.log(reserve1);
  
          setReserve((prev) => ({
            ...prev,
            reserve0: reserve0,
            reserve1: reserve1,
          }));
  
        } catch (error) {
          console.error("Error fetching reserves:", error);
        }
      }
    };
  
    reserves();
  }, [contract, provider,reserve.reserve0,reserve.reserve1]);
  // const addLiquidity = async (amount) => {
  //   // const amount = ethers.utils.parseEther("0.01")
  //   await RBNTContract.approve(contractAddress, amount);
  //   await SANDYContract.approve(contractAddress, amount);
  //   await contract.addLiquidity(amount, amount);
  // };

  const handleRBNTChange = async (e) => {
    const reserve0 = reserve.reserve0 * 100;
    const reserve1 = reserve.reserve1 * 100;
    const amountWithFee = (e.target.value * 995) / 1000;
   // console.log(reserve0);
   // console.log(reserve1);
  
    if (reserve0 + amountWithFee !== 0) {
      setToken((prev) => ({
        ...prev,
        RBNT: e.target.value,
       // SANDY :  100,
        SANDY: (reserve1 * amountWithFee) / (reserve0 + amountWithFee),
      }));
    } else {
      setToken((prev) => ({
        ...prev,
        RBNT: e.target.value,
        SANDY: 0, // Set SANDY to 0 if division by zero occurs
      }));
    }
  };

  const swap = async () => {
    const amount = token.RBNT * 100;
    setLoading(true);
    try {
      const approval = await RBNTContract.approve(contractAddress, amount);
      await approval.wait();
      const swapping = await contract.exchange(amount);
      await swapping.wait();
      alert("Swap complete");
      
      // Fetch updated reserves
      const reserve0 = await contract.reserveRBNT();
      const reserve1 = await contract.reserveSANDY();
      
      // Update the reserves state
      setReserve((prev) => ({
        ...prev,
        reserve0: reserve0,
        reserve1: reserve1,
      }));
      
      // Recalculate SANDY token value based on the updated reserves
      const reserve0Value = reserve0 * 100;
      const reserve1Value = reserve1 * 100;
      const amountWithFee = (token.RBNT * 995) / 1000;
      const sandyValue = (reserve1Value * amountWithFee) / (reserve0Value + amountWithFee);
  
      // Update the token state with the recalculated SANDY value
      setToken((prev) => ({
        ...prev,
        SANDY: sandyValue,
      }));
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
    setToken((prev) => ({ ...prev, RBNT: "", SANDY: "" }));
  };
  


  return (
    <>
     
      <div className={styles.head}>
            <h2 className={styles.heading}>SANDYSWAP : {contractAddress} </h2>
      </div>
      <Form
        token={token}
        onChange={handleRBNTChange}
        onClick={swap}
        val="Swap"
        loading={loading}
      />
    </>
  );
}