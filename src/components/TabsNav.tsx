import { cn } from "../libs/style";
import { useNftsTabViewStore } from "../store/nftsTabView";
import { useTabStore } from "../store/tab";

export function TabsNav() {
    const { changeTab, tab } = useTabStore();
    const { changeNftsTabView, setNftMint } = useNftsTabViewStore();

    return (
        <nav>
            <div className="grid grid-cols-3 gap-5">
                <button
                    onClick={() => {
                        changeTab("nfts");
                        changeNftsTabView("nfts");
                        setNftMint(null);
                    }}
                    className={cn(
                        "text-sm font-medium p-2 hover:border-b-2 border-white flex justify-center items-center",
                        tab === "nfts" && "border-b-2 border-white"
                    )}
                >
                    Collectibles
                </button>
            </div>
        </nav>
    );
}
