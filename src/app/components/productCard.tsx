import React from 'react';
import { PayButton } from './payButton';

interface productType {
    name : string,
    image: string,
    price: number
}
const ProductCard = ({ product } : {product : productType}) => {
  return (
    // <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-xl shadow-md overflow-hidden w-[35rem] h-[10rem] border border-1 border-text">
        <div className="flex">
          <div className="flex-shrink-0 bg-accent/40">
            <img className="h-full w-[10rem] object-cover" src={product.image} alt={product.name} />
          </div>
          <div className="p-8 h-full flex flex-col justify-center items-start">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{product.name}</div>
            <p className="mt-2 text-gray-500">${product.price}</p>
            <PayButton price={product.price} />
          </div>
        </div>
      </div>
    // </div>
  );
};

export default ProductCard
