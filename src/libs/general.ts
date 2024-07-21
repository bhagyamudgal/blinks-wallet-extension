export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);

        return true;
    } catch (error) {
        console.error("copyToClipboard =>", error);
        return false;
    }
}
