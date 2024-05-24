import ProductCard from "../components/productCard"
const Products = () => {
    return (
        <div>
            heeelo
            <ProductCard product={{
                image : "https://imageio.forbes.com/specials-images/imageserve/64650aa8c2219ac74a7a7422/Apple-VR-headset-mockup-image-/960x0.jpg?format=jpg&width=960",
                name: "VR headset",
                price: 0
            }}/>
        </div>
    )
}

export default Products
