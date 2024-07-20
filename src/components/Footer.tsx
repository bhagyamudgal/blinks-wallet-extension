import { RiNftFill } from "react-icons/ri";
import { cn } from "../libs/style";
import { useNftsTabViewStore } from "../store/nftsTabView";
import { useTabStore } from "../store/tab";

export function Footer() {
    const { changeTab, tab } = useTabStore();
    const { changeNftsTabView, setNftMint } = useNftsTabViewStore();

    return (
        <footer id="footer" className="bg-blue-200 sticky bottom-0 z-10">
            <div className="grid grid-cols-3 gap-5">
                <button
                    onClick={() => {
                        changeTab("nfts");
                        changeNftsTabView("nfts");
                        setNftMint(null);
                    }}
                    className={cn(
                        "p-4 text-2xl hover:bg-blue-400 flex justify-center items-center",
                        tab === "nfts" && "bg-blue-400"
                    )}
                >
                    <RiNftFill />
                </button>
            </div>
        </footer>
    );
}
