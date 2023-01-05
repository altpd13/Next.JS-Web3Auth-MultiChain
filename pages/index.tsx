import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import RPC from "./api/web3Rpc";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from "ethers";
//MultiChain
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import Web3 from "web3";

const clientId = "";

export default function Home() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  useEffect(() => {
    // const initEthereum = async () => {
    //   try {
    //     const web3auth = new Web3Auth({
    //       clientId,
    //       chainConfig: {
    //         chainNamespace: CHAIN_NAMESPACES.EIP155,
    //         chainId: "0x1",
    //         rpcTarget: "https://rpc.ankr.com/eth",
    //         displayName: "Ethereum TestNet",
    //         blockExplorer: "https://etherscan.io",
    //         ticker: "ETH",
    //         tickerName: "Ethereum", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    //       },
    //     });
    //     setWeb3auth(web3auth);
    //     await web3auth.initModal();
    //     setProvider(web3auth.provider);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // };
    // // this only initializes the BSC provider
    // const initBSC = async () => {
    //   try {
    //     const web3auth = new Web3Auth({
    //       clientId: clientId, // get it from Web3Auth Dashboard
    //       chainConfig: {
    //         chainNamespace: CHAIN_NAMESPACES.EIP155,
    //         chainId: "0x38", // hex of 56
    //         rpcTarget: "https://rpc.ankr.com/bsc",
    //         displayName: "Binance SmartChain Mainnet",
    //         blockExplorer: "https://bscscan.com/",
    //         ticker: "BNB",
    //         tickerName: "BNB",
    //       },
    //     });
    //     setWeb3auth(web3auth);
    //     await web3auth.initModal();
    //     setProvider(web3auth.provider);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };
    const initMultiChain = async () => {
      try {
        console.log("INIT MULTICHAIN");
        const web3auth = new Web3Auth({
          clientId: clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
          },
        });
        setWeb3auth(web3auth);
        await web3auth.initModal();
        setProvider(web3auth.provider);
      } catch (e) {
        console.log("ERROR");
        console.log(e);
      }
    };
    initMultiChain();
  }, []);
  const changeToBNB = async () => {
    if (!provider) {
      throw new Error("Provider not set");
    }
    const bnbPrivateKey = provider.request({
      method: "eth_private_key",
    });
    const bnbPrivateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainId: "0x38",
          rpcTarget: "https://rpc.ankr.com/bsc",
          displayName: "Binance SmartChain Mainnet",
          blockExplorer: "https://bscscan.com/",
          ticker: "BNB",
          tickerName: "BNB",
        },
      },
    });
    await bnbPrivateKeyProvider.setupProvider(bnbPrivateKey);
    setProvider(bnbPrivateKeyProvider.provider);
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };
  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(JSON.stringify(address));
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    alert(JSON.stringify(balance));
    console.log(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };
  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getChainId} className="card">
        Get Chain ID
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={sendTransaction} className="card">
        Send Transaction
      </button>
      <button onClick={signMessage} className="card">
        Sign Message
      </button>
      <button onClick={getPrivateKey} className="card">
        Get Private Key
      </button>
      <button onClick={changeToBNB}>Change to Binance Smart Chain</button>
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & NextJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/Web3Auth/tree/master/examples/react-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}
