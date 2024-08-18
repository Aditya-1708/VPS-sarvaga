import React from 'react';
import Slider from 'react-slick';
import img1 from "../../assets/sarees/product 1/jpeg-optimizer__DSC1394-2.JPG";
import img2 from "../../assets/_DSC1465-1.JPG";
import img3 from "../../assets/_DSC1439-1.JPG";
import img4 from "../../assets/_DSC1528-1.JPG";
import img5 from "../../assets/_DSC1535-1.JPG";
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const productsData = [
    {
        id: 5,
        img: img1,
        title: "Chanderi Silk Saree",
        rating: 4.0,
        author: "Purple",
        aosDelay: "0",
    },
    {
        id: 12,
        img: img2,
        title: "Soft Cotton Saree",
        rating: 4.6,
        author: "Cyan",
        aosDelay: "100",
    },
    {
        id: 10,
        img: img3,
        title: "Soft Cotton Saree",
        rating: 4.2,
        author: "Pista",
        aosDelay: "200",
    },
    {
        id: 9,
        img: img4,
        title: "Soft Cotton Saree",
        rating: 4.7,
        author: "Pink",
        aosDelay: "300",
    },
    {
        id: 11,
        img: img5,
        title: "Soft Cotton Saree",
        rating: 4.9,
        author: "Tasar",
        aosDelay: "400",
    },
];



const Trending = () => {
    const navigate = useNavigate();
    const handleViewProducts = ()=>{
        navigate('/sarees')
    }
    const handleClick = (id) => {
        navigate(`/description/${id}`);
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

    return (
        <div className='mt-14 mb-12 flex justify-center'>
            <div className="container bg-gray-100 py-10 px-5 rounded-lg shadow-lg">
                {/* Header Section */}
                <div className="text-left mx-6 mb-10 max-w-[600px]">
                    <h1 data-aos="fade-up" className="text-2xl text-black font-bold">Trending Products</h1>
                    <p data-aos="fade-up" className='text-sm text-gray-500 mt-1'>
                        Discover the latest trends in fashion with our top-rated products. Handpicked by experts, these styles are sure to make you stand out.
                    </p>
                </div>
                {/* Body Section */}
                <Slider {...settings}>
                    {productsData.map((data) => (
                        <div
                            key={data.id}
                            className="relative p-4 bg-white shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                            onClick={() => handleClick(data.id)}
                            data-aos="fade-up"
                            data-aos-delay={data.aosDelay}
                        >
                            <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-gradient-to-b from-transparent to-gray-200">
                                <img src={data.img} alt={data.title} className="w-full h-full object-cover opacity-80 transition-opacity duration-300 hover:opacity-100" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                                    <h3 className="font-semibold text-lg">{data.title}</h3>
                                    <p className="text-sm">{data.author}</p>
                                    <div className="flex items-center gap-1 mt-1 text-yellow-400">
                                        <FaStar />
                                        <span>{data.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
                <div className='flex justify-center mt-10'>
                    <button onClick={handleViewProducts} className="text-white bg-purple-700 hover:bg-purple-600 border border-purple-700 rounded-xl w-[200px] hover:w-[250px] transition-all duration-300 px-4 py-2">
                        View All Products
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Trending;
