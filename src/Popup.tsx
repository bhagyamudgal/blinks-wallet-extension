import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Wallet } from "./components/Wallet";
import { useWalletStore } from "./store/wallet";

const queryClient = new QueryClient();

const Popup = () => {
    const { address } = useWalletStore();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="relative border-2 border-black overflow-auto h-[600px] flex flex-col justify-between">
                <Header />
                <div className="flex flex-col flex-1">
                    <Wallet />
                </div>
                {address && <Footer />}
            </div>
        </QueryClientProvider>
    );
};

export default Popup;
