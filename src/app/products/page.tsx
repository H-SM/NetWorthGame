import ProductCard from "../components/productCard"
const Products = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[100vh] gap-2">
            <ProductCard product={{
                image: "https://imageio.forbes.com/specials-images/imageserve/64650aa8c2219ac74a7a7422/Apple-VR-headset-mockup-image-/960x0.jpg?format=jpg&width=960",
                name: "VR headset",
                price: 300
            }} />
            <ProductCard product={{
                image: "https://imageio.forbes.com/specials-images/imageserve/64650aa8c2219ac74a7a7422/Apple-VR-headset-mockup-image-/960x0.jpg?format=jpg&width=960",
                name: "headPhones - stringer",
                price: 100
            }} />
            <ProductCard product={{
                image: "https://imageio.forbes.com/specials-images/imageserve/64650aa8c2219ac74a7a7422/Apple-VR-headset-mockup-image-/960x0.jpg?format=jpg&width=960",
                name: "earbuds",
                price: 10
            }} />
        </div>
    )
}

export default Products
