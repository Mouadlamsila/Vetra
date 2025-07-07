"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Search, Filter, X, Store, Package, Star, MapPin, ArrowLeft, SortAsc, SortDesc } from "lucide-react"
import { useTranslation } from "react-i18next"
import axios from "axios"

export default function SearchResults() {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    
    const [results, setResults] = useState({ stores: [], products: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('all') // 'all', 'stores', 'products'
    const [sortBy, setSortBy] = useState('relevance') // 'relevance', 'name', 'price', 'rating'
    const [sortOrder, setSortOrder] = useState('desc')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        category: '',
        priceRange: [0, 1000],
        inStockOnly: false,
        rating: 0
    })

    useEffect(() => {
        if (query) {
            performSearch()
        }
    }, [query])

    const performSearch = async () => {
        setLoading(true)
        setError(null)

        try {
            // Search stores
            const storesResponse = await axios.get(
                `https://stylish-basket-710b77de8f.strapiapp.com/api/boutiques?filters[$or][0][nom][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=*`
            )

            // Search products
            const productsResponse = await axios.get(
                `https://stylish-basket-710b77de8f.strapiapp.com/api/products?filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=*`
            )

            setResults({
                stores: storesResponse.data.data,
                products: productsResponse.data.data
            })
        } catch (error) {
            console.error('Search error:', error)
            setError('Failed to perform search')
        } finally {
            setLoading(false)
        }
    }

    const getFilteredResults = () => {
        let filtered = { stores: [...results.stores], products: [...results.products] }

        // Apply category filter
        if (filters.category) {
            filtered.products = filtered.products.filter(product => 
                product.category?.name?.toLowerCase() === filters.category.toLowerCase()
            )
        }

        // Apply price filter
        filtered.products = filtered.products.filter(product => 
            product.prix >= filters.priceRange[0] && product.prix <= filters.priceRange[1]
        )

        // Apply stock filter
        if (filters.inStockOnly) {
            filtered.products = filtered.products.filter(product => product.stock > 0)
        }

        // Apply rating filter
        if (filters.rating > 0) {
            filtered.products = filtered.products.filter(product => {
                const avgRating = product.rating_products?.length > 0 
                    ? product.rating_products.reduce((acc, r) => acc + r.stars, 0) / product.rating_products.length
                    : 0
                return avgRating >= filters.rating
            })
        }

        return filtered
    }

    const getSortedResults = (items, type) => {
        const sorted = [...items]

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => {
                    const aName = type === 'stores' ? a.nom : a.name
                    const bName = type === 'stores' ? b.nom : b.name
                    return sortOrder === 'asc' 
                        ? aName.localeCompare(bName)
                        : bName.localeCompare(aName)
                })
                break
            case 'price':
                if (type === 'products') {
                    sorted.sort((a, b) => 
                        sortOrder === 'asc' ? a.prix - b.prix : b.prix - a.prix
                    )
                }
                break
            case 'rating':
                sorted.sort((a, b) => {
                    const aRating = a.rating_products?.length > 0 
                        ? a.rating_products.reduce((acc, r) => acc + r.stars, 0) / a.rating_products.length
                        : 0
                    const bRating = b.rating_products?.length > 0 
                        ? b.rating_products.reduce((acc, r) => acc + r.stars, 0) / b.rating_products.length
                        : 0
                    return sortOrder === 'asc' ? aRating - bRating : bRating - aRating
                })
                break
            default: // relevance - keep original order
                break
        }

        return sorted
    }

    const filteredResults = getFilteredResults()
    const sortedStores = getSortedResults(filteredResults.stores, 'stores')
    const sortedProducts = getSortedResults(filteredResults.products, 'products')

    const totalResults = sortedStores.length + sortedProducts.length

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-red-500 text-xl">{error}</p>
                        <button 
                            onClick={performSearch}
                            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link to="/" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Search className="h-8 w-8 text-purple-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {t('Search Results')}
                            </h1>
                            <p className="text-gray-600">
                                {totalResults} {t('results found for')} "{query}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    {/* Tabs */}
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'all' 
                                    ? 'bg-white text-purple-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {t('All')} ({totalResults})
                        </button>
                        <button
                            onClick={() => setActiveTab('stores')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'stores' 
                                    ? 'bg-white text-purple-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {t('Stores')} ({sortedStores.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'products' 
                                    ? 'bg-white text-purple-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {t('Products')} ({sortedProducts.length})
                        </button>
                    </div>

                    {/* Sort and Filter */}
                    <div className="flex items-center space-x-4 ml-auto">
                        <div className="flex items-center space-x-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="relevance">{t('Relevance')}</option>
                                <option value="name">{t('Name')}</option>
                                <option value="price">{t('Price')}</option>
                                <option value="rating">{t('Rating')}</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                            </button>
                        </div>
                        
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Filter className="h-4 w-4" />
                            <span>{t('Filters')}</span>
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('Category')}
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">{t('All Categories')}</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="home">Home</option>
                                    <option value="beauty">Beauty</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('Price Range')}
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters({
                                            ...filters, 
                                            priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Min"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters({
                                            ...filters, 
                                            priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStockOnly}
                                        onChange={(e) => setFilters({...filters, inStockOnly: e.target.checked})}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{t('In Stock Only')}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div className="space-y-8">
                    {/* Stores */}
                    {(activeTab === 'all' || activeTab === 'stores') && sortedStores.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <Store className="h-6 w-6 mr-2 text-purple-600" />
                                {t('Stores')} ({sortedStores.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedStores.map((store) => (
                                    <div key={store.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Store className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {store.nom}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                    {store.description}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        <span>{store.location || 'Location not specified'}</span>
                                                    </div>
                                                    {store.rating_boutiques?.length > 0 && (
                                                        <div className="flex items-center">
                                                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                                            <span>
                                                                {(store.rating_boutiques.reduce((acc, r) => acc + r.stars, 0) / store.rating_boutiques.length).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    {(activeTab === 'all' || activeTab === 'products') && sortedProducts.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <Package className="h-6 w-6 mr-2 text-purple-600" />
                                {t('Products')} ({sortedProducts.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="aspect-square overflow-hidden">
                                            <img 
                                                src={product.imgMain?.url || '/placeholder.svg'} 
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-lg font-bold text-purple-600">
                                                    €{product.prix}
                                                </span>
                                                {product.rating_products?.length > 0 && (
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 text-yellow-400" />
                                                        <span className="text-sm text-gray-600 ml-1">
                                                            {(product.rating_products.reduce((acc, r) => acc + r.stars, 0) / product.rating_products.length).toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                </span>
                                                {product.category && (
                                                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                        {product.category.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {totalResults === 0 && (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {t('No results found')}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {t('Try adjusting your search terms or filters')}
                            </p>
                            <button
                                onClick={() => {
                                    setFilters({
                                        category: '',
                                        priceRange: [0, 1000],
                                        inStockOnly: false,
                                        rating: 0
                                    })
                                    setActiveTab('all')
                                }}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                {t('Clear Filters')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 