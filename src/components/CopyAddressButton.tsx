import { useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { useInterval } from "usehooks-ts";
import { copyToClipboard } from "../libs/general";
import { cn } from "../libs/style";

type CopyAddressButtonProps = React.ComponentProps<"button"> & {
    address: string;
};

export function CopyAddressButton({
    address,
    className,
    ...props
}: CopyAddressButtonProps) {
    const [success, setSuccess] = useState(false);

    useInterval(() => {
        if (success) {
            setSuccess(false);
        }
    }, 3000);

    async function handleAddressCopy() {
        const success = await copyToClipboard(address);
        setSuccess(success);
    }

    return (
        <button
            type="button"
            className={cn("text-xl", className)}
            onClick={handleAddressCopy}
            disabled={success}
            {...props}
        >
            {success ? <FaCheck /> : <FaRegCopy />}
        </button>
    );
}

export default CopyAddressButton;
