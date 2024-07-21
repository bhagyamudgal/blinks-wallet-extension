import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/Header";
import { Wallet } from "./components/Wallet";

const queryClient = new QueryClient();

const Popup = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="relative text-white bg-background-dark overflow-auto h-[600px] flex flex-col justify-between">
                <Header />
                <div className="flex flex-col flex-1">
                    <Wallet />
                </div>
            </div>
        </QueryClientProvider>
    );
};

export default Popup;
