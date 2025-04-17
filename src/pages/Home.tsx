import React from 'react';
import { ArrowRight, Shield, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import ImageCarousel from '../components/ImageCarousel';

function Home() {
  const carouselImages = [
    {
      url: "/carousel/qualiden_analise.jpeg",
      alt: "Qualiden do Brasil",
      type: "image"
    },
    {
      url: "/carousel/qualiden_carregamento.jpeg",
      alt: "Nossos Produtos",
      type: "image"
    },
    {
      url: "/carousel/qualiden_project.jpeg",
      alt: "Nossos Projetos",
      type: "image"
    },
    {
      url: "/carousel/qualiden_container.jpeg",
      alt: "Logística Global",
      type: "image"
    },
    {
      url: "/carousel/qualiden_acucar.mp4",
      alt: "Processamento de Açúcar",
      type: "video",
      poster: "/carousel/qualiden_container.jpeg"
    },
    {
      url: "/carousel/qualiden_carr_container.mp4",
      alt: "Carregamento de Containers",
      type: "video",
      poster: "/carousel/qualiden_carregamento.jpeg"
    },
    {
      url: "/carousel/qualiden_encomenda.mp4",
      alt: "Entrega de Produtos",
      type: "video",
      poster: "/carousel/qualiden_analise.jpeg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/containerimg.jpg')",
            transform: 'scaleX(-1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-xl">
            <h1 className="text-6xl font-playfair font-bold mb-6">Global Trading Solutions</h1>
            <p className="text-xl mb-8 text-gray-100">Your trusted partner in international trade. We connect quality products with global markets.</p>
            <Link 
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View Our Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">We provide comprehensive export solutions with a focus on quality and reliability</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_35px_60px_rgba(0,0,0,0.45)] transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm backdrop-saturate-150">
              <Globe className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-playfair font-semibold mb-4">Global Reach</h3>
              <p className="text-gray-600">Connected with international markets across multiple continents</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_35px_60px_rgba(0,0,0,0.45)] transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm backdrop-saturate-150">
              <Shield className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-playfair font-semibold mb-4">Quality Assured</h3>
              <p className="text-gray-600">Strict quality control measures for all our products</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_35px_60px_rgba(0,0,0,0.45)] transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm backdrop-saturate-150">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-playfair font-semibold mb-4">Competitive Pricing</h3>
              <p className="text-gray-600">Best market rates with flexible payment terms</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div id="about-us" className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">About Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One of Brazil's premier supplying companies since 1992
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h3 className="text-3xl font-playfair font-semibold text-gray-900">Our Story</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Since 1992, Qualiden of Brazil has been dedicated to supplying products of the highest quality at the most competitive prices. Our commitment to exceptional service drives us to consistently exceed our customers' expectations.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We take immense pride in being recognized as one of Brazil's leading supplying companies. This reputation is built on our continuous effort to enhance our product range and services, ensuring 100% customer satisfaction through close collaboration with our clients.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Qualiden of Brazil, we offer an extensive range of premium products, each selected to provide the best value for your investment. Our unwavering commitment to exceptional service enables us to work closely with our customers, guaranteeing complete satisfaction in every transaction.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
              <ImageCarousel 
                images={carouselImages}
                interval={6000}
                className="aspect-[16/9]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="flex justify-center">
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Our Products</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our wide range of high-quality products tailored for global markets.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Commodities */}
                <div className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img 
                      src="/commodities.jpg" 
                      alt="Commodities" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">Commodities</h3>
                    <p className="text-gray-600 mb-4">
                      High-quality commodities for global markets.
                    </p>
                    <Link 
                      to="/products" 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View More
                    </Link>
                  </div>
                </div>

                {/* Household & Groceries */}
                <div className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img 
                      src="/householdgrocery.jpg" 
                      alt="Household & Groceries" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">Household & Groceries</h3>
                    <p className="text-gray-600 mb-4">
                      Essential household items and groceries for everyday needs.
                    </p>
                    <Link 
                      to="/products" 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;