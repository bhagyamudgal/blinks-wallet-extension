import { useWalletStore } from "../store/wallet";
import { CreateWallet } from "./CreateWallet";
import { Tabs } from "./Tabs";

export function Wallet() {
    const { address } = useWalletStore();

    if (address) {
        return <Tabs />;
    } else {
        return <CreateWallet />;
    }
}
