import { useConnect, useAccount, useDisconnect, useWalletClient } from "wagmi";
import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
} from "@biconomy/account";
import { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { ethers } from "ethers";

export default function Home() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [smartAccountAddress, setSmartAccountAddress] = useState();
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);

  // Create a provider for the Polygon Amoy network
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon"
  );

  const connectAccount = async () => {
    if (!walletClient) return;

    console.log("walletClient", walletClient);

    const biconomySmartAccount = await createSmartAccountClient({
      signer: walletClient,
      bundlerUrl:
        "https://bundler.biconomy.io/api/v2/137/dewj2189.wh1289hU-7E49-45ic-af80-Uu13sknnU",

      biconomyPaymasterApiKey: "",
      index: 0,
    });
    console.log({ biconomySmartAccount });
    const saAddress = await biconomySmartAccount.getAccountAddress();
    setSmartAccountAddress(saAddress);
    setSmartAccount(biconomySmartAccount);
    console.log(biconomySmartAccount);
  };

  const createTeamAndJoin = async () => {
    if (
      smartAccount !== null &&
      smartAccountAddress !== null &&
      provider !== null
    ) {
      try {
        const tx1 = {
          to: "0x7B9B2a7447dC1357C8CcDA59909424c40530D98C",
          value: 1,
        };

        const nonce = await smartAccount.getNonce();
        console.log("nonce", nonce);

        const transactions = [tx1];

        const signedUserOp = await smartAccount?.sendTransaction(transactions);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Head>
        <title>Biconomy x WAGMI</title>
        <meta name="description" content="WAGMI Hooks With Biconomy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Biconomy x WAGMI Example</h1>
        {address && <h2>EOA: {address}</h2>}
        {smartAccountAddress && <h2>Smart Account: {smartAccountAddress}</h2>}
        {connectors.map((connector) => (
          <button key={connector.id} onClick={() => connect({ connector })}>
            {connector.name}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}

        {error && <div>{error.message}</div>}
        {isConnected && <button onClick={disconnect}>Disconnect</button>}
        {isConnected && <button onClick={connectAccount}>Connect</button>}
        {isConnected && <button onClick={createTeamAndJoin}>Send Eth</button>}
      </main>
    </>
  );
}
