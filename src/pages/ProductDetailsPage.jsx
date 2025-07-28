import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getProductById, getRelatedProducts } from '../services/productService';
import toast from 'react-hot-toast';

const { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiArrowLeft, FiZoomIn } = FiIcons;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct({
          ...productData,
          inStock: productData.in_stock
        });

        // Fetch related products
        const related = await getRelatedProducts(id, productData.category);
        setRelatedProducts(related.map(p => ({
          ...p,
          inStock: p.in_stock
        })));
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading product..." />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <Link to="/products" className="btn-coffee">
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Mock additional images for demonstration
  const productImages = [
    product.image,
    product.image, // In real app, these would be different images
    product.image,
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - Cogli Caffe</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-cream-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-coffee-600 hover:text-coffee-800">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-coffee-600 hover:text-coffee-800">
                Products
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <motion.div
                className="relative bg-white rounded-xl overflow-hidden shadow-lg aspect-square"
                whileHover={{ scale: imageZoomed ? 1 : 1.05 }}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setImageZoomed(!imageZoomed)}
                />
                <button
                  onClick={() => setImageZoomed(!imageZoomed)}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <SafeIcon icon={FiZoomIn} className="w-5 h-5 text-coffee-600" />
                </button>
              </motion.div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-coffee-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-coffee-800 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon
                        key={i}
                        icon={FiStar}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 4)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">
                      ({product.rating || 4.5})
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.category === 'coffee' ? 'Coffee' : 'Merchandise'}
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-coffee-600">
                ${product.price}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <SafeIcon icon={FiIcons.FiMinus} className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium ${
                      product.inStock
                        ? 'btn-coffee'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-5 h-5" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      inWishlist
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-gray-300 text-gray-600 hover:border-coffee-600 hover:text-coffee-600'
                    }`}
                  >
                    <SafeIcon icon={FiHeart} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiTruck} className="w-5 h-5 text-coffee-600" />
                    <span className="text-sm text-gray-700">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiShield} className="w-5 h-5 text-coffee-600" />
                    <span className="text-sm text-gray-700">Quality Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-coffee-800 mb-8 text-center">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    viewMode="grid"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetailsPage;