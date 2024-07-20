import { useNftsTabViewStore } from "../store/nftsTabView";
import { Nft } from "./Nft";
import { Nfts } from "./Nfts";

export function NftsTab() {
    const { nftsTabView } = useNftsTabViewStore();

    switch (nftsTabView) {
        case "nfts":
            return <Nfts />;
        case "nft":
            return <Nft />;
    }
}
