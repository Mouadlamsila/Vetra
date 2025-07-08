"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Minus, Plus, ShoppingCart, X } from "lucide-react"

// Mock cart data
const cartItems = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e040d5bfb6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    quantity: 1,
    color: "Black",
  },
  {
    id: "3",
    name: "Portable Wireless Speaker",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1606220588911-5117e04b09f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    quantity: 2,
    color: "Blue",
  },
]

export function CartDrawer() {
  const [items, setItems] = useState(cartItems)
  const [isOpen, setIsOpen] = useState(false)

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div>
      <button
        className="relative p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center cursor-pointer">
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold">Votre Panier</h2>
                  <button onClick={() => setIsOpen(false)} className="cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 cursor-pointer">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">Votre panier est vide</h3>
                    <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
                    <button
                      className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/categories/electronics" className="cursor-pointer">Continuer vos achats</Link>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-auto py-6">
                      <div className="space-y-6 px-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border bg-white cursor-pointer">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-gray-500 text-xs">Couleur: {item.color}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 px-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="px-2 text-sm">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 px-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6 px-4">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sous-total</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frais de livraison</span>
                          <span className="font-medium">{shipping === 0 ? "Gratuit" : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-lg">${total.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <button
                            className="border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md cursor-pointer"
                            onClick={() => setIsOpen(false)}
                          >
                            <Link to="/categories/electronics" className="cursor-pointer">
                              Continuer
                            </Link>
                          </button>
                          <button
                            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md cursor-pointer"
                            onClick={() => setIsOpen(false)}
                          >
                            <Link to="/checkout" className="cursor-pointer">
                              Commander
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
