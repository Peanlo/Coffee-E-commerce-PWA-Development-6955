import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const { FiCoffee, FiHeart, FiGlobe, FiAward, FiUsers, FiTrendingUp } = FiIcons;

const AboutPage = () => {
  const values = [
    {
      icon: FiCoffee,
      title: 'Quality First',
      description: 'We source only the finest coffee beans from sustainable farms around the world.'
    },
    {
      icon: FiHeart,
      title: 'Passionate Team',
      description: 'Our team is passionate about coffee and dedicated to bringing you the best experience.'
    },
    {
      icon: FiGlobe,
      title: 'Global Sourcing',
      description: 'We work directly with farmers to ensure fair trade and sustainable practices.'
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'Every product meets our high standards for quality, taste, and presentation.'
    }
  ];

  const stats = [
    { number: '50+', label: 'Coffee Varieties' },
    { number: '10,000+', label: 'Happy Customers' },
    { number: '15+', label: 'Countries Sourced' },
    { number: '5', label: 'Years Experience' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Coffee enthusiast with 15+ years in the industry'
    },
    {
      name: 'Michael Chen',
      role: 'Head Roaster',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Master roaster specializing in small-batch artisan coffee'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Quality Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Ensures every bean meets our exceptional standards'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Cogli Caffe</title>
        <meta name="description" content="Learn about Cogli Caffe's mission to bring you the finest coffee beans and merchandise from around the world." />
      </Helmet>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-coffee-800 text-white py-20">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Our Story
              </h1>
              <p className="text-xl md:text-2xl text-cream-200 max-w-3xl mx-auto">
                From bean to cup, we're passionate about delivering exceptional coffee experiences
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-coffee-800 mb-6">
                  Brewing Excellence Since 2019
                </h2>
                <div className="space-y-4 text-coffee-600">
                  <p>
                    Cogli Caffe was born from a simple passion: the love of exceptional coffee. 
                    Our founder, Sarah Johnson, traveled the world tasting different coffee varieties 
                    and learning about the craft from local farmers and roasters.
                  </p>
                  <p>
                    What started as a personal quest for the perfect cup became a mission to share 
                    these incredible flavors with coffee lovers everywhere. We believe that great 
                    coffee has the power to bring people together, create moments of joy, and 
                    support communities around the world.
                  </p>
                  <p>
                    Today, we work directly with farmers in over 15 countries, ensuring fair 
                    trade practices and sustainable farming methods. Every bean is carefully 
                    selected, expertly roasted, and packaged with care to preserve its unique 
                    character and flavor profile.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Coffee plantation"
                    className="w-full h-96 object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-coffee-600 max-w-3xl mx-auto">
                These principles guide everything we do, from sourcing to serving
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-xl shadow-lg"
                >
                  <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={value.icon} className="w-8 h-8 text-coffee-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-coffee-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-coffee-600">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-coffee-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-cream-200 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-cream-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-coffee-600 max-w-3xl mx-auto">
                The passionate people behind your perfect cup of coffee
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-coffee-800 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-coffee-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-coffee-500 text-sm">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-coffee-700 to-coffee-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-cream-100 leading-relaxed">
                To connect coffee lovers with exceptional, ethically-sourced coffee while 
                supporting sustainable farming practices and building lasting relationships 
                with coffee communities worldwide. Every cup should tell a story of quality, 
                care, and community.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;