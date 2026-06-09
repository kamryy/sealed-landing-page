import algosdk from 'algosdk';

const isMainnet = process.env.NEXT_PUBLIC_ALGO_NETWORK === 'mainnet';

const NODE_URL = isMainnet
  ? 'https://mainnet-api.4160.nodely.dev'
  : 'https://testnet-api.algonode.cloud';

export const algodClient = new algosdk.Algodv2('', NODE_URL, '');