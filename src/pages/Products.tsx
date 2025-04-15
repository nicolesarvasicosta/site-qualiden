import React, { useState, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, Package2, Loader2, CheckCircle, ArrowUpRight } from 'lucide-react';
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
      'Commodities': '/commodities.jpg',
      'Household & Groceries': '/householdgrocery.jpg',
      default: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    };
    return images[categoryName] || images.default;
  }

  function getSubcategoryImage(subcategoryName: string): string {
    const images: Record<string, string> = {
      'Grains': 'https://images.unsplash.com/photo-1530272279787-89fc3bfd29d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Metals': 'https://images.unsplash.com/photo-1533062618053-d51e617307ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Oil & Gas': 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Rice': 'https://images.unsplash.com/photo-1568347355280-d33fdf77d42a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Coffee': 'https://images.unsplash.com/photo-1599639957043-f9b160406391?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Beverages': 'https://images.unsplash.com/photo-1596803244535-925769f389fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Fertilizer': 'https://images.unsplash.com/photo-1599401464382-667c2a58fbb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Bazaar': 'https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'Cleaning': 'https://images.unsplash.com/photo-1616680213669-92c78de95f16?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      default: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    };
    return images[subcategoryName] || images.default;
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
      <div className="relative h-[600px] bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          {selectedCategory ? (
            <div className="w-full">
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
              <p className="text-xl text-gray-100 max-w-2xl">
                Browse our selection of {selectedCategory.toLowerCase()}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <h1 className="text-6xl font-playfair font-bold text-white mb-6">Our Product Catalog</h1>
              <p className="text-xl text-gray-100 max-w-2xl">
                Discover our comprehensive range of export products. Quality solutions for global markets.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-24">
        {!selectedCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {categoriesData.map((category) => (
              <div 
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <LazyImage
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0"
                    width={1200}
                    height={675}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
                  
                  <div className={`
                    absolute inset-0 bg-blue-600/20 backdrop-blur-sm transition-opacity duration-300
                    ${hoveredCategory === category.name ? 'opacity-100' : 'opacity-0'}
                  `} />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-4xl font-playfair font-bold text-white mb-4 transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                      {category.name}
                    </h3>
                    <div className="flex items-center space-x-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-white text-xl">Explore Category</span>
                      <ArrowUpRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 bg-white">
                  <div className="flex justify-between items-center text-lg text-gray-600">
                    <span>{category.subcategories.length} Subcategories</span>
                    <span>•</span>
                    <span>
                      {category.subcategories.reduce((total, sub) => total + sub.products.length, 0)} Products
                    </span>
                  </div>
                </div>
              </div>
            ))}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData[0]?.subcategories.flatMap(subcategory => 
                subcategory.products.map(product => (
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
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;