import ProductCard from "../components/productCard"
const Products = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[100vh]">
        <h1 className="text-2xl font-bold mb-4 uppercase">Products</h1>
        <div className="flex flex-wrap justify-center items-center w-full h-fit gap-2 overflow-x-scroll">
            <ProductCard product={{
                image: "https://imageio.forbes.com/specials-images/imageserve/64650aa8c2219ac74a7a7422/Apple-VR-headset-mockup-image-/960x0.jpg?format=jpg&width=960",
                name: "VR headset",
                price: 300
            }} />
            <ProductCard product={{
                image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/b8743ff9-6bcf-4009-b220-c00f31196bc9.__CR0,0,2000,2000_PT0_SX300_V1___.jpg",
                name: "headPhones - stringer",
                price: 100
            }} />
            <ProductCard product={{
                image: "https://media.croma.com/image/upload/v1698303250/Croma%20Assets/Entertainment/Wireless%20Earbuds/Images/302474_pnwatt.png",
                name: "NOTHING EARBUDS",
                price: 50
            }} />
            <ProductCard product={{
                image: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1710332950/Croma%20Assets/Entertainment/Wireless%20Earbuds/Images/305511_zpspbj.png",
                name: "nothing cmf earbuds",
                price: 30
            }} />
            <ProductCard product={{
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsrlRNhCDhW2iQD9cDPzlxlNIW_Ggg4kUz-A&s",
                name: "earbuds",
                price: 10
            }} />
            <ProductCard product={{
                image: "https://resource.logitech.com/content/dam/logitech/en/products/mice/mouse-pad-studio-series/gallery/logitech-mouse-pad-studio-series-corner-view-graphite.png",
                name: "Logitic mouse pad",
                price: 20
            }} />
        </div>
        </div>

    )
}

export default Products
