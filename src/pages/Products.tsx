import React, { useState, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, Package2, Loader2, CheckCircle, ArrowUpRight, ArrowRight } from 'lucide-react';
import { contentfulClient, ContentfulCategory } from '../lib/contentful';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ContentfulCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Cache for Contentful responses
  const contentfulCache = new Map<string, any>();

  const fetchWithCache = useCallback(async (key: string, fetchFn: () => Promise<any>) => {
    if (contentfulCache.has(key)) {
      return contentfulCache.get(key);
    }

    const data = await fetchFn();
    contentfulCache.set(key, data);
    return data;
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cacheKey = 'categories';
        const response = await fetchWithCache(cacheKey, () => 
          contentfulClient.getEntries<ContentfulCategory>({
            content_type: 'newsite',
            include: 1,
            select: [
              'sys.id',
              'fields.category',
              'fields.subcategory',
              'fields.product',
              'fields.productMedia'
            ].join(',')
          })
        );

        setCategories(response.items as ContentfulCategory[]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, [fetchWithCache]);

  const handleContactNavigation = (subcategory: string) => {
    navigate(`/contact?category=${encodeURIComponent(subcategory)}`);
  };

  const categoriesData = React.useMemo(() => {
    const categoryMap = new Map();
    
    categories.forEach(item => {
      const category = item.fields.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          image: getCategoryImage(category),
          subcategories: new Map()
        });
      }
      
      const subcategory = item.fields.subcategory;
      const categoryData = categoryMap.get(category);
      
      if (!categoryData.subcategories.has(subcategory)) {
        categoryData.subcategories.set(subcategory, {
          name: subcategory,
          products: [],
          image: getSubcategoryImage(subcategory)
        });
      }
      
      categoryData.subcategories.get(subcategory).products.push({
        sys: { id: item.sys.id },
        fields: {
          name: item.fields.product,
          category: item.fields.category,
          subcategory: item.fields.subcategory,
          productMedia: item.fields.productMedia
        }
      });
    });

    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      image: data.image,
      subcategories: Array.from(data.subcategories.values())
    }));
  }, [categories]);

  function getCategoryImage(categoryName: string): string {
    const images: Record<string, string> = {
      'Commodities': '/commodities_qualiden.png',  // Changed from '/commodities.jpg'
      'Household & Groceries': '/householdgrocery.jpg',
      default: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    };
    return images[categoryName] || images.default;
  }

  function getSubcategoryImage(subcategoryName: string): string {
    const defaultImage = '/logo_inteiro.png';
    return defaultImage;
  }

  function getProductImage(product: any): string {
    try {
      if (product.fields.productMedia && product.fields.productMedia.fields) {
        const media = product.fields.productMedia;
        if (media.fields.file && media.fields.file.url) {
          const url = media.fields.file.url;
          return url.startsWith('//') ? `https:${url}` : url;
        }
      }
    } catch (error) {
      console.error('Error getting product image:', error);
    }
    
    return getSubcategoryImage(product.fields.subcategory);
  }

  const filteredData = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!selectedCategory) return categoriesData;

    const categoryData = categoriesData.find(cat => cat.name === selectedCategory);
    if (!categoryData) return [];

    const filteredSubcategories = categoryData.subcategories.map(sub => ({
      ...sub,
      products: sub.products.filter(product => {
        const matchesSearch = !query || product.fields.name.toLowerCase().includes(query);
        const matchesSubcategory = !selectedSubcategory || product.fields.subcategory === selectedSubcategory;
        return matchesSearch && matchesSubcategory;
      })
    }));

    return [{
      ...categoryData,
      subcategories: filteredSubcategories
    }];
  }, [categoriesData, selectedCategory, selectedSubcategory, searchQuery]);

  const paginatedProducts = React.useMemo(() => {
    const allProducts = filteredData[0]?.subcategories.flatMap(subcategory => 
      subcategory.products
    ) || [];
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return allProducts.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const totalPages = React.useMemo(() => {
    const totalProducts = filteredData[0]?.subcategories.flatMap(subcategory => 
      subcategory.products
    ).length || 0;
    
    return Math.ceil(totalProducts / ITEMS_PER_PAGE);
  }, [filteredData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 animate-pulse">Loading our product catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[600px] bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-40 z-10">
          {selectedCategory ? (
            <>
              <div className="flex items-center mb-4">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                  className="flex items-center text-white hover:text-blue-200 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Categories
                </button>
              </div>
              <h1 className="text-6xl font-playfair font-bold text-white mb-4">
                {selectedCategory}
              </h1>
              <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                Browse our selection of {selectedCategory.toLowerCase()}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-playfair font-bold text-white mb-6 title-center">
                Our Product Catalog
              </h1>
              <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                Discover our comprehensive range of export products. Quality solutions for global markets.
              </p>
            </>
          )}
        </div>
        {/* Organic SVG shape at the bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[120px] z-0"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C300,140 600,0 900,80 C1200,160 1440,40 1440,40 L1440,120 L0,120 Z"
            fill="#fff"
            fillOpacity="1"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-24">
        {!selectedCategory && (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Commodities */}
              <div 
                key="Commodities"
                onClick={() => setSelectedCategory("Commodities")}
                onMouseEnter={() => setHoveredCategory("Commodities")}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <LazyImage
                    src="/commodities_qualiden.png" 
                    alt="Commodities"
                    className="absolute inset-0"
                    width={1200}
                    height={675}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
                </div>
                <div className="p-8 bg-white">
                  <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Commodities</h3>
                  <p className="text-gray-600">High-quality commodities for global markets.</p>
                </div>
              </div>

              {/* Household & Groceries */}
              <div 
                key="Household & Groceries"
                onClick={() => setSelectedCategory("Household & Groceries")}
                onMouseEnter={() => setHoveredCategory("Household & Groceries")}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <LazyImage
                    src="/householdgrocery.jpg"
                    alt="Household & Groceries"
                    className="absolute inset-0"
                    width={1200}
                    height={675}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
                </div>
                <div className="p-8 bg-white">
                  <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Household & Groceries</h3>
                  <p className="text-gray-600">Essential household items and groceries for everyday needs.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory && (
          <div>
            <div className="mb-12 max-w-md mx-auto">
              <div className={`
                relative rounded-full transition-all duration-300 bg-white
                ${isSearchFocused ? 'shadow-lg scale-105' : 'shadow'}
              `}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-transparent rounded-full focus:outline-none focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`
                  px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105
                  ${!selectedSubcategory
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'}
                `}
              >
                All Products
              </button>
              {filteredData[0]?.subcategories.sort((a, b) => a.name.localeCompare(b.name)).map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => setSelectedSubcategory(sub.name)}
                  className={`
                    px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105
                    ${selectedSubcategory === sub.name
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'}
                  `}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map(product => (
                  <div
                    key={product.sys.id}
                    className="group bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                  >
                    <div className="relative aspect-[4/3]">
                      <LazyImage
                        src={getProductImage(product)}
                        alt={product.fields.name}
                        className="absolute inset-0"
                        width={800}
                        height={600}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactNavigation(product.fields.subcategory);
                          }}
                          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all duration-300"
                        >
                          <ArrowUpRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {product.fields.name}
                          </h3>
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {product.fields.subcategory}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleContactNavigation(product.fields.subcategory)}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center space-x-2"
                      >
                        <span>Request Quote</span>
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors duration-200"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="ml-2 text-sm font-medium">Previous</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                          transition-all duration-200
                          ${currentPage === pageNum 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-100'}
                        `}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors duration-200"
                  >
                    <span className="mr-2 text-sm font-medium">Next</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;