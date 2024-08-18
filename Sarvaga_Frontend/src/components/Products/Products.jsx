import React from 'react';
import Slider from 'react-slick';
import img1 from "../../assets/sarees/product 1/jpeg-optimizer__DSC1395-1.JPG";
import img2 from "../../assets/sarees/product 2/jpeg-optimizer__DSC1407-1.JPG";
import img3 from "../../assets/sarees/product 3/jpeg-optimizer__DSC1423-1.JPG";
import img4 from "../../assets/_DSC1528-1.JPG";
import img5 from "../../assets/sarees/product 4/variant 4/_DSC1487.JPG";
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductsData = [
    {
        id: 5,
        img: img1,
        title: "Chanderi Silk",
        rating: 4.8,
        color: "Royal Blue",
        aosDelay: "0",
    },
    {
        id: 7,
        img: img2,
        title: "Silk zari stripe",
        rating: 4.5,
        color: "Magenta",
        aosDelay: "100",
    },
    {
        id: 8,
        img: img3,
        title: "Dupion Silk",
        rating: 5.0,
        color: "Rama",
        aosDelay: "200",
    },
    {
        id: 9,
        img: img4,
        title: "Cotton",
        rating: 4.3,
        color: "Pink",
        aosDelay: "300",
    },
    {
        id: 12,
        img: img5,
        title: "Cotton Saree",
        rating: 4.6,
        color: "Sky Blue",
        aosDelay: "400",
    },
];

const Products = () => {
    const navigate = useNavigate();

    let isDragging = false;

    const handleMouseDown = () => {
        isDragging = false;
    };

    const handleMouseMove = () => {
        isDragging = true;
    };

    const handleClick = (id) => {
        if (!isDragging) {
            navigate(`/description/${id}`);
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,  // Show 4 photos in a row on web view
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,  // For tablets and below
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,  // For small tablets and large phones
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 480,  // For mobile devices
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const handleViewProducts = ()=>{
        navigate('/sarees')
    }

    return (
        <div className='mt-14 mb-12 flex justify-center'>
            <div className="container bg-gray-100 py-10 px-5 rounded-lg shadow-lg">
                {/* Header Section */}
                <div className="text-left mb-10 mx-6 max-w-[600px]">
                    <h1 data-aos="fade-up" className="text-2xl text-black font-bold">Top Selling Products</h1>
                    <p data-aos="fade-up" className='text-sm text-gray-500 mt-1'>Explore the top selling products and find what's best for you.</p>
                </div>
                {/* Body Section */}
                <Slider {...settings}>
                    {ProductsData.map((data) => (
                        <div
                            key={data.id}
                            className="relative p-4 bg-white shadow-lg rounded-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onClick={() => handleClick(data.id)}
                        >
                            <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-gradient-to-b from-transparent to-gray-200">
                                <img src={data.img} alt={data.title} className="w-full h-full object-cover opacity-80 transition-opacity duration-300 hover:opacity-100" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                                    <h3 className="font-semibold text-lg">{data.title}</h3>
                                    <p className="text-sm">{data.color}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <FaStar className="text-yellow-400" />
                                        <span>{data.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
                {/* View All Button */}
                <div className='flex justify-center mt-10'>
                    <button onClick={handleViewProducts} className="text-white bg-purple-700 hover:bg-purple-600 border border-purple-700 rounded-xl w-[200px] hover:w-[250px] transition-all duration-300 px-4 py-2">
                        View All Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Products;
