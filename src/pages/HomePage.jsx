import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementBanner from '../components/common/AnnouncementBanner';
import SeasonalBanner from '../components/common/SeasonalBanner';

const { FiArrowRight, FiStar, FiTruck, FiShield, FiHeart, FiCoffee } = FiIcons;

const HomePage = () => {
  const features = [
    {
      icon: FiCoffee,
      title: 'Premium Quality',
      description: 'Carefully sourced coffee beans from the finest regions around the world.'
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your coffee fresh to your door.'
    },
    {
      icon: FiShield,
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee on all our coffee products.'
    },
    {
      icon: FiHeart,
      title: 'Ethical Sourcing',
      description: 'Supporting fair trade and sustainable coffee farming practices.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'The best coffee I\'ve ever had! The flavor is absolutely incredible.',
      location: 'Seattle, WA'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      comment: 'Fast shipping and amazing quality. Will definitely order again!',
      location: 'Portland, OR'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      comment: 'Love the variety of blends available. Each one is unique and delicious.',
      location: 'San Francisco, CA'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Cogli Caffe - Premium Coffee & Merchandise</title>
        <meta name="description" content="Discover premium coffee beans and artisanal merchandise at Cogli Caffe. Quality guaranteed, ethically sourced, delivered fresh." />
      </Helmet>
      <Header />
      
      {/* Additional Promotional Banners */}
      <AnnouncementBanner />
      <SeasonalBanner />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-coffee-800 via-coffee-700 to-coffee-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Premium Coffee <br />
                  <span className="text-cream-200">Experience</span>
                </h1>
                <p className="text-xl md:text-2xl text-cream-100 mb-8 leading-relaxed">
                  Discover our carefully curated selection of artisanal coffee beans and premium merchandise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="btn-coffee text-lg px-8 py-4 flex items-center justify-center gap-2 group"
                  >
                    Shop Now
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="border-2 border-white text-white hover:bg-white hover:text-coffee-800 px-8 py-4 rounded-lg font-semibold transition-colors text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Premium coffee beans"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-cream-100 text-coffee-800 p-4 rounded-full shadow-lg"
                >
                  <SafeIcon icon={FiCoffee} className="w-8 h-8" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
                Why Choose Cogli Caffe?
              </h2>
              <p className="text-xl text-coffee-600 max-w-3xl mx-auto">
                We're committed to delivering the finest coffee experience with exceptional service and quality.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={feature.icon} className="w-8 h-8 text-coffee-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-coffee-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-coffee-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Preview */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-coffee-600 max-w-3xl mx-auto">
                Explore our most popular coffee blends and merchandise.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="coffee-card bg-white rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="h-64 bg-gradient-to-br from-coffee-200 to-coffee-300 flex items-center justify-center">
                    <SafeIcon icon={FiCoffee} className="w-16 h-16 text-coffee-600" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-coffee-800 mb-2">
                      Premium Blend #{item}
                    </h3>
                    <p className="text-coffee-600 mb-4">
                      Rich, aromatic coffee with notes of chocolate and caramel.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-coffee-600">$24.99</span>
                      <button className="btn-coffee px-4 py-2">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/products"
                className="btn-coffee text-lg px-8 py-4 inline-flex items-center gap-2 group"
              >
                View All Products
                <SafeIcon icon={FiArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 bg-coffee-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-coffee-600">
                Don't just take our word for it - hear from our satisfied customers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <SafeIcon key={i} icon={FiStar} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-coffee-700 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-coffee-800">{testimonial.name}</p>
                    <p className="text-coffee-500 text-sm">{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-coffee-700 to-coffee-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience Premium Coffee?
              </h2>
              <p className="text-xl text-cream-100 mb-8">
                Join thousands of satisfied customers and discover your perfect blend today.
              </p>
              <Link
                to="/products"
                className="bg-white text-coffee-700 hover:bg-cream-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2 group"
              >
                Start Shopping
                <SafeIcon icon={FiArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;