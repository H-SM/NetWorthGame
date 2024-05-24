"use client";

import { useConnect, useAccount, useWriteContract, usePrepareTransactionRequest } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState } from 'react';
// import { mainnet } from 'viem/chains';
import { sepolia } from 'viem/chains';
import { DAI_ABI } from "../lib/DAI_ABI"

export const PayButton = ({ price }: { price: number }) => {
  const { connectAsync } = useConnect()
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [started, setStarted] = useState(false)
  const [errors, setErrors] = useState()
  const [completed, setCompleted] = useState(false)

  const handlePayment = async () => {
    try {
      setErrors('')
      setStarted(true)
      if(!address) {
        await connectAsync({ chainId: sepolia.id, connector: injected()})
      }

      const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
      const receiverAddress = '0xC152377B87AaF1b29cE74e1516A9d15F7bc167C6';

      const data = await writeContractAsync({
        chainId: sepolia.id,
        
        // address: '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0' '0x6B175474E89094C44Da98b954EedeAC495271d0F', // change to receipient address
        address: receiverAddress,
        functionName: 'transfer',
        abi: DAI_ABI,
        args: [
          contractAddress,
          BigInt(price * 1000000),
        ]
      })

    //   const data = await usePrepareTransactionRequest({
    //     address: contractAddress,
    //     abi: selectedAsset.asset_id === 'USDT' ? usdtAbi : erc20ABI,
    //     functionName: 'transfer',
    //     args: [receiverAddress, parseUnits(`${debouncedAmount}`, token.data?.decimals ?? 0),
    //     ],
    // })
      if (!data || data === '0x') {
        throw new Error('Transfer function returned no data');
      }

      setCompleted(true)
      console.log(data)
    } catch(err) {
      console.log(err)
      setStarted(false)
      setErrors("Payment failed. Please try again.")
    }
  }

  return (
    <>
      {!completed && (
        <button 
          disabled={started}
          className="mt-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-whi   te bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
          onClick={handlePayment}
        >
          {started ? "Confirming..." : "Pay Now"}
        </button>
      )}
      {completed && <p className='text-stone-800 mt-2 bg-green-200 rounded-md text-sm py-2 px-4'>Thank you for your payment.</p>}
      {errors && <p className='text-stone-800 mt-2 bg-red-200 rounded-md text-sm py-2 px-4'>{errors}</p>}
    </>
  )
}