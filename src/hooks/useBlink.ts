import type { ActionGetResponse, ActionPostResponse } from "@solana/actions";

export default function useBlink() {
    async function fetchBlink(url: string): Promise<ActionGetResponse> {
        const response = await fetch(url);
        return response.json();
    }

    async function fetchTransaction(
        url: string,
        account: string
    ): Promise<ActionPostResponse> {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ account: account }),
        });
        return response.json();
    }

    return { fetchBlink, fetchTransaction };
}
