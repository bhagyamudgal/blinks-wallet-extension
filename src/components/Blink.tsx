import type { Action, ActionComponent } from "@dialectlabs/blinks";
import type { DAS } from "@shyft-to/js";
import {
    ComputeBudgetProgram,
    Connection,
    sendAndConfirmTransaction,
    Transaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { useState } from "react";
import ReactPlayer from "react-player";
import { env } from "../env";
import { useWalletStore } from "../store/wallet";
import { Button } from "./Button";

export function Blink({
    action,
    nft,
}: {
    action: Action;
    nft: DAS.GetAssetResponse;
}) {
    const { address, keypair } = useWalletStore();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [txSig, setTxSig] = useState<string | null>(null);

    const video_url = nft.content?.metadata.attributes?.find(
        (att) => att.trait_type === "video_url"
    )?.value;

    if (!address || !keypair) {
        return null;
    }

    async function handleActionPost(a: ActionComponent, value?: string) {
        if (!address || !keypair) {
            return null;
        }

        setIsLoading((prev) => ({ ...prev, [a.label]: true }));
        try {
            setError(null);

            if (value) {
                a.setValue(value, a.parameter.name);
            }

            const res = await a.post(address);

            console.log({ res });

            if (!res.message) {
                throw new Error("Something went wrong");
            }

            const connection = new Connection(env.RPC_URL, "confirmed");

            console.log({ connection });

            const block = await connection.getLatestBlockhash({
                commitment: "confirmed",
            });

            console.log({ block });

            const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 1,
            });

            const tx = Transaction.from(Buffer.from(res.transaction, "base64"));

            tx.add(addPriorityFee);
            tx.feePayer = keypair.publicKey;
            tx.recentBlockhash = block.blockhash;

            console.log({ tx });

            tx.sign(keypair);

            const txSig = await sendAndConfirmTransaction(
                connection,
                tx,
                [keypair],
                {
                    commitment: "confirmed",
                }
            );

            console.log({ txSig });

            if (!txSig) {
                throw new Error("Tx sig not found!");
            }

            setSuccess(res.message);
            setTxSig(txSig);
        } catch (error) {
            console.log({ error });
            setSuccess(null);
            setError(
                action.error ||
                    "An error occurred while processing your request. Please try again later."
            );
        }
        setIsLoading((prev) => ({ ...prev, [a.label]: false }));
    }

    return (
        <div className="space-y-2 p-4">
            {success && video_url && txSig ? (
                <ReactPlayer
                    url={`${video_url}?txSig=${txSig}`}
                    style={{
                        width: "100%",
                    }}
                    width={360}
                    controls={true}
                    playing={true}
                />
            ) : (
                <img
                    src={action.icon}
                    alt={action.title}
                    className="aspect-square"
                />
            )}

            <h1 className="text-xl font-bold">{action.title}</h1>
            <p>{action.description}</p>

            {action.actions?.map((a) => {
                if (!a?.parameter) {
                    return (
                        <Button
                            isDisabled={
                                isLoading[a.label] ||
                                action.disabled ||
                                !!success
                            }
                            onClick={() => handleActionPost(a)}
                            isLoading={isLoading[a.label]}
                        >
                            {a.label}
                        </Button>
                    );
                } else {
                    return (
                        <form
                            onSubmit={(form) => {
                                form.preventDefault();
                                const input = document.getElementById(
                                    `input-${a.parameter.name}`
                                ) as HTMLInputElement | null;

                                if (!input) {
                                    return;
                                }

                                const value = input.value;

                                handleActionPost(a, value);
                            }}
                            className="space-y-2"
                        >
                            <input
                                className="w-full border p-2 border-card-background-dark rounded-md space-y-2"
                                placeholder={a.parameter.label}
                                name={a.parameter.name}
                                id={`input-${a.parameter.name}`}
                                required={a.parameter.required}
                            />

                            <Button
                                type="submit"
                                isDisabled={
                                    isLoading[a.label] ||
                                    action.disabled ||
                                    !!success
                                }
                                isLoading={isLoading[a.label]}
                            >
                                {a.label}
                            </Button>
                        </form>
                    );
                }
            })}

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </div>
    );
}
