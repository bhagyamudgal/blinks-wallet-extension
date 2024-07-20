import { useTabStore } from "../store/tab";
import { NftsTab } from "./NftsTab";

export function Tabs() {
    const { tab } = useTabStore();

    switch (tab) {
        case "nfts":
            return <NftsTab />;
    }
}
