import { useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import OwnerWalletABI from "./abi/OwnerWallet.json";
import KTTokenABI from "./abi/KTToken.json";

const CONTRACT_ADDRESS = "0x6a3C185c75D522228B2CE12576aD8068BA8be3b6";
const CONTRACT_ADDRESS_KT = "0x00Ba66B6f4b9Ec382AAee325d1dc0C130a1C68CF";

function App() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>("");
  const [ktBalance, setKTBalance] = useState<string>("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setCurrentAccount(accounts[0]);
  };

  const deposit = async () => {
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, OwnerWalletABI.abi, signer);
    const tx = await contract.deposit({ value: ethers.parseEther("0.01") });
    await tx.wait();
    alert("✅ Deposited 0.01 ETH");
  };

  const transferEth = async () => {
    if (!recipient) return alert("Enter recipient address");
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, OwnerWalletABI.abi, signer);
    const tx = await contract.transferTo(recipient, ethers.parseEther("0.01"));
    await tx.wait();
    alert(`✅ Sent 0.01 ETH to ${recipient}`);
  };

  const getBalanceKT = async () => {
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(
      CONTRACT_ADDRESS_KT,
      KTTokenABI.abi,
      provider
    );
    const bal = await contract.getBalanceKT();
    setKTBalance(`${ethers.formatUnits(bal, 18)} KT`);
  };

  const transferKT = async () => {
    if (!recipient) return alert("Enter recipient address");
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS_KT, KTTokenABI.abi, signer);
    const tx = await contract.transferKT(
      recipient,
      ethers.parseUnits("0.1", 18)
    );
    await tx.wait();
    alert(`✅ Sent 0.1 KT to ${recipient}`);
  };

  const getBalance = async () => {
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(
      CONTRACT_ADDRESS,
      OwnerWalletABI.abi,
      provider
    );
    const bal = await contract.getBalance();
    alert(`💰 Contract Balance: ${ethers.formatEther(bal)} ETH`);
  };

  // ---------- STYLES (Inline) ----------
  const container: React.CSSProperties = {
    minHeight: "100vh",
    background: "#121212",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const button: React.CSSProperties = {
    padding: "12px 22px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "0.25s",
  };

  const primaryBtn = {
    ...button,
    background: "#007bff",
  };

  const successBtn = {
    ...button,
    background: "#28a745",
  };

  const warningBtn = {
    ...button,
    background: "#f0ad4e",
  };

  const inputBox: React.CSSProperties = {
    padding: "10px",
    width: "260px",
    borderRadius: "6px",
    border: "1px solid #555",
    background: "#1e1e1e",
    color: "white",
    outline: "none",
  };

  return (
    <div style={container}>
      <h1 style={{ marginBottom: "10px" }}>Owner Wallet DApp</h1>

      {!currentAccount ? (
        <button
          style={primaryBtn}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3399ff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <p style={{ color: "#4ee44e" }}>Connected: {currentAccount}</p>
      )}

      <button
        style={successBtn}
        onMouseOver={(e) => (e.currentTarget.style.background = "#4edc6a")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#28a745")}
        onClick={deposit}
      >
        Deposit 0.01 ETH
      </button>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          style={inputBox}
          type="text"
          placeholder="Recipient Wallet Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <button
          style={primaryBtn}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3399ff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          onClick={transferEth}
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          style={primaryBtn}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3399ff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          onClick={transferKT}
        >
          Send 0.1 KT Token
        </button>
        <button
          style={{ ...primaryBtn, marginLeft: "10px" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3399ff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          onClick={getBalanceKT}
        >
          Show My KT Balance
        </button>
        <div>
          {ktBalance ? (
            <p style={{ marginTop: "10px", color: "green" }}>
              KT Balance: {ktBalance}
            </p>
          ) : (
            <p style={{ marginTop: "10px", color: "red" }}>KT Balance: N/A</p>
          )}
        </div>
      </div>

      <button
        style={warningBtn}
        onMouseOver={(e) => (e.currentTarget.style.background = "#f5c06b")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#f0ad4e")}
        onClick={getBalance}
      >
        Show Contract Balance
      </button>
    </div>
  );
}

export default App;
