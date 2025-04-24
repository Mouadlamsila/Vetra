import {Link} from "react-router-dom"
import { Heart, ShoppingCart, Star } from "lucide-react"

export default function ProductCard({ product, layout = "grid" }) {
  if (layout === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row gap-6 bg-white rounded-lg border overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="relative w-full sm:w-48 h-48">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded-full ${
                product.badge === "Sale" ? "bg-red-500" : product.badge === "New" ? "bg-green-500" : "bg-purple-700"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{product.name}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>

          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">({product.reviews})</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-purple-700">${product.price}</span>
              {product.oldPrice && <span className="text-sm text-gray-500 line-through">${product.oldPrice}</span>}
            </div>

            <div className="flex gap-2">
              <button className="rounded-full h-9 w-9 flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                <Heart className="h-4 w-4" />
              </button>
              <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-lg">
        <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded-full ${
                product.badge === "Sale" ? "bg-red-500" : product.badge === "New" ? "bg-green-500" : "bg-purple-700"
              }`}
            >
              {product.badge}
            </span>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="rounded-full h-9 w-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white">
              <Heart className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          {product.stock <= 10 && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs text-center py-1 rounded-full backdrop-blur-sm">
              {product.stock <= 5 ? "Plus que " + product.stock + " en stock!" : "Stock limité"}
            </div>
          )}
        </div>
    </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-purple-700">${product.price}</span>
            {product.oldPrice && <span className="text-sm text-gray-500 line-through">${product.oldPrice}</span>}
          </div>
          <button className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-md">
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
