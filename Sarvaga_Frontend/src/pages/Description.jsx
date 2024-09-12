import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropagateLoader from 'react-spinners/PropagateLoader';
import { useAuth0 } from "@auth0/auth0-react";

const Description = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated ,user} = useAuth0();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/user/products/ID/${id}`);
        setProduct(response.data);
        if (response.data.images.length > 0) {
          setSelectedImage(response.data.images[0].url);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PropagateLoader color='#A855F7' />
      </div>
    );
  }

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img
            className="w-12 h-12 object-contain"
            src={`https://api.sarvagafashions.com${product.images[i].url}`}
            alt={product.productName}
          />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Enable/disable arrows as needed
  };

  const handleAdd2Cart = async(productID) => {
    if (isAuthenticated) {
      try
      {
        let user_response = await axiosInstance.post("/user/signin",{
          username : user.name,
          email : user.email
        })
        if(user_response.data.msg == "User not found")
        {
          user_response = await axiosInstance.post("user/signup",{
            username : user.name,
            email : user.email,
          })
        }
        const user_id = user_response.data.id;
        console.log(user_id);
        console.log(productID)
        const response = await axiosInstance.post("user/carts/additem",{
          userId : user_id,
          productId : productID
        })
        console.log(response)
        alert("Added to Cart");
      }
      catch(e){
        console.error("error in adding product to cart (user)")
      }
    } else {
      alert("Login to add product into cart");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container p-4">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="w-full md:w-1/2">
            <Slider {...settings}>
              {product.images.map((image) => (
                <div key={image.id} className="flex justify-center">
                   
                  <img
                    className="bg-gray-100 w-full h-auto md:max-h-96 object-contain"
                    src={`https://api.sarvagafashions.com${image.url}`}
                    alt={product.productName}
                    onClick={() => handleImageClick(image.url)}
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-800 mt-4 md:my-4 pt-2">{product.productName}</h1>
            <div className="space-y-2">
              <p className="text-lg text-gray-600"><strong className="font-semibold">Product Code:</strong> {product.productCode}</p>
              <p className="text-lg text-gray-600"><strong className="font-semibold">Category:</strong> {product.category}</p>
              <p className="text-lg text-gray-600"><strong className="font-semibold">Color:</strong> {product.color}</p>
              <p className="text-lg text-gray-600"><strong className="font-semibold">Fabric:</strong> {product.fabric}</p>
              <p className="text-lg text-gray-600"><strong className="font-semibold">Description:</strong> {product.description}</p>
              <p className="text-lg text-gray-600"><strong className="font-semibold">Price:</strong> ₹{product.price}</p>
            </div>
            <div className="flex items-center mt-6">
              <label htmlFor="quantity" className="mr-2 text-lg font-semibold">Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-20 p-2 border border-gray-300 rounded text-lg"
              />
            </div>
            <button
              onClick={()=>handleAdd2Cart(product.id)}
              className="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Description;