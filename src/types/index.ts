export type Nft = {
    name: string;
    symbol: string;
    description: string;
    image: string;
    externalUrl: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
    external_url: string;
    animation_url: string;
};
