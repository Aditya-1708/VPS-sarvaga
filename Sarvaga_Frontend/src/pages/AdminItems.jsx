import React, { useState, useCallback, useEffect } from 'react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import Card from '../components/Cards/CardAdmin';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/ConfirmDialog';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import axiosInstance from '../api/AxiosInstance';

const AdminItems = () => {
  const { isLoading , user } = useAuth0();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDialogIsOpen, setConfirmDialogIsOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [category, setCategory] = useState('Saree');
  const [id, setId] = useState(0);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [productCode, setProductCode] = useState('');
  const [specialCategory, setSpecialCategory] = useState('');
  const [isAdmin , setisAdmin] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/admin/products/all");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  console.log(user)

  useEffect(()=>{
   
    const checkIsAdmin = async()=>{
      try{
      const response = await axiosInstance.post("/admin/signin",
        {
          username : user.name,
          email : user.email,
          name : user.given_name
        }
      )
      if(response.status == 200){
        setisAdmin(true);
      }
      else{
        setisAdmin(false);
      }
    }
    catch(error)
    {
     console.error("Unable to access admin status");
    }
   } 
   checkIsAdmin();
  })

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('fabric', fabric);
    formData.append('color', color);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('productCode', productCode);
    formData.append('specialCategory', specialCategory);

    selectedFiles.forEach(file => {
      formData.append('productImage', file);
    });

    try {
      const response = await axiosInstance.post('/admin/products/addProducts', formData);

      if (response.status === 201) {
        const newProduct = response.data.product;
        setProducts([...products, newProduct]);
        closeModal();
        alert('Product added successfully');
      } else {
        console.error('Failed to add product:', response.data.msg);
      }
    } catch (error) {
      console.error('Error uploading product:', error.response?.data || error.message);
    }
  };

  const openModal = (product = null) => {
    setSelectedFiles([]);
    setFilePreviews([]);
    setEditProduct(product !== null ? products[product] : null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFiles([]);
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    setFilePreviews([]);
  };

  const handleDrop = useCallback((acceptedFiles) => {
    console.log("Files dropped:", acceptedFiles);

    const uniqueFiles = acceptedFiles.filter(
      (file) => !selectedFiles.some((selectedFile) => selectedFile.name === file.name)
    );

    console.log("Unique files:", uniqueFiles);

    const newPreviews = uniqueFiles.map(file => URL.createObjectURL(file));
    setSelectedFiles(prevFiles => [...prevFiles, ...uniqueFiles]);
    setFilePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  }, [selectedFiles]);

  const handleDelete = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  const openConfirmDialog = (index, id) => {
    setProductToDelete(index);
    setConfirmDialogIsOpen(true);
    setId(id);
  };

  const closeConfirmDialog = () => {
    setProductToDelete(null);
    setConfirmDialogIsOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete !== null) {
      const updatedProducts = products.filter((_, i) => i !== productToDelete);
      setProducts(updatedProducts);
    }
    try {
      const response = await axiosInstance.delete("/admin/products/delete", {
        data: { id: id }
      });
      console.log(response);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    closeConfirmDialog();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      id: editProduct.id,
      productName: e.target.productName.value,
      description: e.target.description.value,
      fabric: e.target.fabric.value,
      color: e.target.color.value,
      price: parseFloat(e.target.price.value),
      category: category,
      specialCategory: e.target.specialCategory.value,
      productCode: e.target.productCode.value,
    };

    try {
      const response = await axiosInstance.post("/admin/products/updateProduct", updatedProduct);

      if (response.status === 200) {
        const updatedProducts = products.map((product) =>
          product.id === editProduct.id ? response.data.product : product
        );
        setProducts(updatedProducts);
        console.log('Product updated successfully');
      } else {
        console.error('Failed to update product:', response.data.msg);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }

    closeModal();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    selectedFiles.forEach(file => formData.append('images', file));

    formData.append('specialCategory', specialCategory);
    formData.append('category', e.target.category.value);
    formData.append('productName', e.target.productName.value);
    formData.append('description', e.target.description.value);
    formData.append('fabric', e.target.fabric.value);
    formData.append('color', e.target.color.value);
    formData.append('price', parseFloat(e.target.price.value));
    formData.append('productCode', productCode);

    try {
      const response = await axios.post('/products/addProducts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newProduct = response.data.product;

      setProducts([...products, newProduct]);

      closeModal();
    } catch (error) {
      console.error("Error uploading product:", error.response?.data || error.message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
    multiple: true
  });

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <PropagateLoader color='#A855F7' />
        </div>
      ) : (
        <>
          {!isAdmin ? (<>
          <Navbar />
          <div className='flex flex-col items-center justify-center min-h-screen'>
          <p className=' text-lg text-black mb-4'>Unauthorised access to this page</p>
          <div>
          <PropagateLoader color='#A855F7' />
          </div>
          </div>
          </>) : (<>
            <Navbar />
          <div className="p-8 pt-16">
            <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
              onClick={() => openModal()}
            >
              Add Product
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Card
                  key={index}
                  product={product}
                  onEdit={() => openModal(index)}
                  onDelete={() => openConfirmDialog(index, product.id)}
                />
              ))}
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
              <div className="p-4">
                {editProduct === null ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">Add Product</h2>
                    <form onSubmit={handleAddSubmit}>
                      <label htmlFor="productName" className="block text-gray-700 font-semibold mb-2">Product Name:</label>
                      <input type="text" name="productName" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" required />
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category:</label>
                        <select
                          id="category"
                          name="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="border border-gray-300 p-2 rounded w-full"
                        >
                          <option value="Saree">Saree</option>
                          <option value="Salwar Suit">Salwar Suit</option>
                          <option value="Lehenga">Lehenga</option>
                          <option value="Designer">Designer</option>
                        </select>
                      </div>

                      <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Product Description:</label>
                      <textarea name="description" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="fabric" className="block text-gray-700 font-semibold mb-2">Fabric:</label>
                      <input type="text" name="fabric" placeholder="Fabric" value={fabric} onChange={(e)=>setFabric(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="color" className="block text-gray-700 font-semibold mb-2">Color:</label>
                      <input type="text" name="color" placeholder="Color" value={color} onChange={(e)=>setColor(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">Price:</label>
                      <input type="number" step="0.01" name="price" placeholder={price} value={price} onChange={(e)=>setPrice(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="productCode" className="block text-gray-700 font-semibold mb-2">Product Code:</label>
                      <input type="text" name="productCode" placeholder="Product Code" value={productCode} onChange={(e)=>setProductCode(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="specialCategory" className="block text-gray-700 font-semibold mb-2">Special Category:</label>
                      <input type="text" name="specialCategory" placeholder="Special Category" value={specialCategory} onChange={(e)=>setSpecialCategory(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <div
                        {...getRootProps()}
                        className={`border-4 border-dashed p-20 mb-4 text-center ${isDragActive ? 'border-green-500' : 'border-gray-300'} rounded-lg`}
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p className="text-lg font-semibold text-green-500">Drop the files here...</p>
                        ) : (
                          <p className="text-lg font-semibold text-gray-500">Drag and drop images here, or click to select files <p className='text-red-500'>(Minimum 2 images)</p></p>
                        )}
                      </div>

                      {filePreviews.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                          {filePreviews.map((preview, index) => (
                            <div key={index} className="relative border border-gray-300 rounded-lg overflow-hidden">
                              <img
                                src={preview}
                                alt="Selected"
                                className="w-full h-32 object-contain"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => handleDelete(index)}
                              >
                                Delete
                              </button>
                              <p className="text-center text-sm mt-2">{selectedFiles[index].name}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-400"
                        onClick={handleUpload}
                      >
                        Upload
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                    <form onSubmit={handleEditSubmit}>
                      <label htmlFor="productName" className="block text-gray-700 font-semibold mb-2">Product Name:</label>
                      <input type="text" name="productName" placeholder="Product Name" defaultValue={editProduct.productName} className="mb-4 p-2 border border-gray-300 rounded w-full" required />
                      
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category:</label>
                        <select
                          id="category"
                          name="category"
                          value={editProduct.category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="border border-gray-300 p-2 rounded w-full"
                        >
                          <option value="Saree">Saree</option>
                          <option value="Salwar Suit">Salwar Suit</option>
                          <option value="Lehenga">Lehenga</option>
                          <option value="Designer">Designer</option>
                        </select>
                      </div>

                      <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Product Description:</label>
                      <textarea name="description" placeholder="Description" defaultValue={editProduct.description} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="fabric" className="block text-gray-700 font-semibold mb-2">Fabric:</label>
                      <input type="text" name="fabric" placeholder="Fabric" defaultValue={editProduct.fabric} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="color" className="block text-gray-700 font-semibold mb-2">Color:</label>
                      <input type="text" name="color" placeholder="Color" defaultValue={editProduct.color} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">Price:</label>
                      <input type="number" step="0.01" name="price" placeholder={editProduct.price} defaultValue={editProduct.price} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="productCode" className="block text-gray-700 font-semibold mb-2">Product Code:</label>
                      <input type="text" name="productCode" placeholder="Product Code" defaultValue={editProduct.productCode} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <label htmlFor="specialCategory" className="block text-gray-700 font-semibold mb-2">Special Category:</label>
                      <input type="text" name="specialCategory" placeholder="Special Category" defaultValue={editProduct.specialCategory} className="mb-4 p-2 border border-gray-300 rounded w-full" required />

                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                        type="submit"
                      >
                        Update
                      </button>
                    </form>
                  </>
                )}
              </div>
            </Modal>
            <ConfirmDialog
              isOpen={confirmDialogIsOpen}
              onClose={closeConfirmDialog}
              onConfirm={handleConfirmDelete}
            />
          </div></>)}
        </>
      )}
    </>
  );
};

export default AdminItems;
