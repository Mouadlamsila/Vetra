"use client"

import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Données pour les graphiques
const salesData = [
  { date: "01/04", ventes: 1200 },
  { date: "02/04", ventes: 1400 },
  { date: "03/04", ventes: 1300 },
  { date: "04/04", ventes: 1800 },
  { date: "05/04", ventes: 1600 },
  { date: "06/04", ventes: 1700 },
  { date: "07/04", ventes: 1400 },
  { date: "08/04", ventes: 1900 },
  { date: "09/04", ventes: 2100 },
  { date: "10/04", ventes: 2300 },
  { date: "11/04", ventes: 2000 },
  { date: "12/04", ventes: 2100 },
  { date: "13/04", ventes: 2400 },
  { date: "14/04", ventes: 2300 },
  { date: "15/04", ventes: 2500 },
  { date: "16/04", ventes: 2700 },
  { date: "17/04", ventes: 2600 },
  { date: "18/04", ventes: 2800 },
  { date: "19/04", ventes: 3000 },
  { date: "20/04", ventes: 3200 },
  { date: "21/04", ventes: 3100 },
  { date: "22/04", ventes: 3300 },
  { date: "23/04", ventes: 3400 },
  { date: "24/04", ventes: 3600 },
  { date: "25/04", ventes: 3700 },
  { date: "26/04", ventes: 3900 },
  { date: "27/04", ventes: 4100 },
  { date: "28/04", ventes: 4300 },
  { date: "29/04", ventes: 4500 },
  { date: "30/04", ventes: 4550 },
]

const productData = [
  { produit: "T-shirt Premium", ventes: 120 },
  { produit: "Écouteurs sans fil", ventes: 98 },
  { produit: "Montre connectée", ventes: 86 },
  { produit: "Vase décoratif", ventes: 72 },
  { produit: "Pantalon Chino", ventes: 65 },
]

const categoryData = [
  { categorie: "Vêtements", valeur: 45, fill: "#6D28D9" },
  { categorie: "Électronique", valeur: 30, fill: "#1e3a8a" },
  { categorie: "Maison", valeur: 15, fill: "#c8c2fd" },
  { categorie: "Beauté", valeur: 10, fill: "#9061f9" },
]

const customerData = [
  { date: "01/04", nouveaux: 5, total: 5 },
  { date: "02/04", nouveaux: 3, total: 8 },
  { date: "03/04", nouveaux: 4, total: 12 },
  { date: "04/04", nouveaux: 6, total: 18 },
  { date: "05/04", nouveaux: 4, total: 22 },
  { date: "06/04", nouveaux: 7, total: 29 },
  { date: "07/04", nouveaux: 5, total: 34 },
  { date: "08/04", nouveaux: 8, total: 42 },
  { date: "09/04", nouveaux: 9, total: 51 },
  { date: "10/04", nouveaux: 11, total: 62 },
  { date: "11/04", nouveaux: 7, total: 69 },
  { date: "12/04", nouveaux: 6, total: 75 },
  { date: "13/04", nouveaux: 8, total: 83 },
  { date: "14/04", nouveaux: 9, total: 92 },
  { date: "15/04", nouveaux: 12, total: 104 },
  { date: "16/04", nouveaux: 14, total: 118 },
  { date: "17/04", nouveaux: 10, total: 128 },
  { date: "18/04", nouveaux: 11, total: 139 },
  { date: "19/04", nouveaux: 13, total: 152 },
  { date: "20/04", nouveaux: 15, total: 167 },
  { date: "21/04", nouveaux: 12, total: 179 },
  { date: "22/04", nouveaux: 14, total: 193 },
  { date: "23/04", nouveaux: 16, total: 209 },
  { date: "24/04", nouveaux: 18, total: 227 },
  { date: "25/04", nouveaux: 15, total: 242 },
  { date: "26/04", nouveaux: 17, total: 259 },
  { date: "27/04", nouveaux: 19, total: 278 },
  { date: "28/04", nouveaux: 21, total: 299 },
  { date: "29/04", nouveaux: 22, total: 321 },
  { date: "30/04", nouveaux: 24, total: 345 },
]

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
          <p className="text-gray-500">Analysez les performances de vos boutiques</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="w-full md:w-[180px] py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
        >
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">3 derniers mois</option>
          <option value="365">12 derniers mois</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Ventes totales</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">€4,550.50</div>
            <p className="text-xs text-gray-500">+12.5% par rapport au mois dernier</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Commandes</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-gray-500">+8.2% par rapport au mois dernier</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Panier moyen</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">€101.12</div>
            <p className="text-xs text-gray-500">+3.1% par rapport au mois dernier</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Visiteurs</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-gray-500">+18.7% par rapport au mois dernier</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`${
              activeTab === 'sales'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Ventes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`${
              activeTab === 'products'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Produits
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`${
              activeTab === 'customers'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Clients
          </button>
        </nav>
      </div>

      {activeTab === 'sales' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Ventes par jour</h2>
            <p className="text-sm text-gray-500">Évolution des ventes sur les 30 derniers jours</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `€${value}`} tickMargin={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                  formatter={(value) => [`€${value}`, "Ventes"]}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventes"
                  stroke="#6D28D9"
                  strokeWidth={2}
                  dot={{ fill: "#6D28D9", r: 4 }}
                  activeDot={{ r: 6, fill: "#1e3a8a" }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Meilleurs produits</h2>
              <p className="text-sm text-gray-500">Produits les plus vendus</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="produit" tick={{ fontSize: 12 }} tickMargin={10} angle={-45} textAnchor="end" />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                    }}
                    formatter={(value) => [`${value} unités`, "Ventes"]}
                  />
                  <Bar dataKey="ventes" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Répartition des ventes</h2>
              <p className="text-sm text-gray-500">Par catégorie de produit</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="valeur"
                    nameKey="categorie"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                    }}
                    formatter={(value) => [`${value}%`, "Pourcentage"]}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Acquisition de clients</h2>
            <p className="text-sm text-gray-500">Nouveaux clients par jour</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="nouveaux" stackId="1" stroke="#6D28D9" fill="#c8c2fd" />
                <Area type="monotone" dataKey="total" stackId="2" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
