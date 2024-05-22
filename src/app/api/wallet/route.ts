import { NextRequest, NextResponse } from 'next/server';
import { initMoralis } from '../../lib/moralis';
import Moralis from 'moralis';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await initMoralis();
    const body = await request.json();
    let { address } = body;

    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: '0x1',
      address
    }); 

    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "error while getting getWalletTokenBalancesPrice" }), { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};