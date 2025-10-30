import { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import "./helpers/interface"; // ✅ ensures window.ethereum is recognized by TS
import type { Signer } from "ethers";

const App = () => {
  const [show, setShow] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTrue, setIsTrue] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const sendTransaction = async () => {
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!inputValue) {
      alert("Please enter a valid recipient address!");
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: inputValue,
        value: ethers.parseEther("0.001"),
      });
      console.log("Transaction sent:", tx);
      await tx.wait();
      setIsTrue(true);
      console.log("Transaction confirmed:", tx);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  // ✅ Function to connect MetaMask
  const handleClick = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      // 1️⃣ Request account access → triggers MetaMask popup
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // 2️⃣ Store connected address
      const userAddress = accounts[0];
      setAddress(userAddress);

      // 3️⃣ Create ethers provider & signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);

      console.log("✅ Connected address:", userAddress);
      console.log("✅ Provider:", provider);
      console.log("✅ Signer:", signer);
    } catch (error) {
      console.error("❌ MetaMask connection failed:", error);
    }
  };

  // ✅ Optional: detect account changes automatically
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAddress(accounts.length > 0 ? accounts[0] : null);
      });
    }
  }, []);

  return (
    <>
      {show ? (
        <>
          <div
            style={{
              backgroundColor: "black",
              color: "white",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h2>Hello, World!</h2>
            <input type="text" onChange={handleChange} />
            <p>You typed: {inputValue}</p>
            <button
              onClick={sendTransaction}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#28A745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              send Money
            </button>
            {isTrue && (
              <p style={{ color: "yellow" }}>Transaction Successful!</p>
            )}
            {address ? (
              <p>
                Connected Account:{" "}
                <span style={{ color: "lime" }}>{address}</span>
              </p>
            ) : (
              <p>No Wallet Connected</p>
            )}
          </div>

          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#FF4136",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setShow((prev) => !prev)}
          >
            Stop Show
          </button>
        </>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            color: "black",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setShow(true)}
          >
            Show Message
          </button>

          <button
            onClick={handleClick}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28A745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {address ? "Wallet Connected ✅" : "Connect Wallet"}
          </button>
        </div>
      )}
    </>
  );
};

export default App;
