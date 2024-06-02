import { NextRequest, NextResponse } from 'next/server';
import { initMoralis } from '../../lib/moralis';
import Moralis from 'moralis';

export async function POST(request: NextRequest) {
  try {
    await initMoralis();
    const body = await request.json();
    let { address } = body;

    const moralisResponse = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: '0x1',
      address
    }); 

    console.log(moralisResponse);
    return NextResponse.json(moralisResponse);
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "error while getting getWalletTokenBalancesPrice" }), { status: 500 });
  }
}

export const runtime = 'edge';
