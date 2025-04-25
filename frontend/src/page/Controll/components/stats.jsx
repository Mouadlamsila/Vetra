"use client"

import React, { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function StatsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const lang = localStorage.getItem('lang');
  
  // State for metrics
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    orders: 0,
    averageCart: 0,
    visitors: 0
  });

  // State for charts data
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('IDUser');
        if (!userId) return;

        // Fetch orders for the selected period
        const ordersResponse = await axios.get(`http://localhost:1337/api/orders?filters[customer][id][$eq]=${userId}&populate=*`);
        const orders = ordersResponse.data.data;

        // Calculate metrics
        const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
        const averageCart = orders.length > 0 ? totalSales / orders.length : 0;

        setMetrics({
          totalSales,
          orders: orders.length,
          averageCart,
          visitors: orders.length * 3 // Placeholder for visitors count
        });

        // Generate sales data for the selected period
        const days = parseInt(selectedPeriod);
        const salesData = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === date.toDateString();
          });
          const totalSales = dayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
          return {
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            ventes: totalSales
          };
        });
        setSalesData(salesData);

        // Fetch products and generate product data
        const productsResponse = await axios.get(`http://localhost:1337/api/products?filters[boutique][owner][id][$eq]=${userId}&populate=*`);
        const products = productsResponse.data.data;

        // Generate product sales data (top 5)
        const productSales = products.map(product => ({
          produit: product.name,
          ventes: Math.floor(Math.random() * 100) // Placeholder for actual sales count
        })).sort((a, b) => b.ventes - a.ventes).slice(0, 5);
        setProductData(productSales);

        // Generate category distribution
        const categoryDistribution = products.reduce((acc, product) => {
          const category = product.categories || 'other';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const categoryData = Object.entries(categoryDistribution).map(([category, count]) => ({
          categorie: category,
          valeur: (count / products.length) * 100,
          fill: getRandomColor()
        }));
        setCategoryData(categoryData);

        // Generate customer data
        const customerData = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === date.toDateString();
          });
          return {
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            nouveaux: dayOrders.length,
            total: orders.filter(order => new Date(order.createdAt) <= date).length
          };
        });
        setCustomerData(customerData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const getRandomColor = () => {
    const colors = ["#6D28D9", "#1e3a8a", "#c8c2fd", "#9061f9"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('stats.stats.title')}</h1>
          <p className="text-gray-500">{t('stats.stats.subtitle')}</p>
        </div>
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full relative md:w-[180px] py-2 px-4 appearance-none rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
          >
            <option value="7">{t('stats.stats.period.options.last7Days')}</option>
            <option value="30">{t('stats.stats.period.options.last30Days')}</option>
            <option value="90">{t('stats.stats.period.options.last3Months')}</option>
            <option value="365">{t('stats.stats.period.options.last12Months')}</option>
          </select>
          <div className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center  pointer-events-none `}>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t('stats.stats.metrics.totalSales.title')}</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">€{metrics.totalSales.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{t('stats.stats.metrics.totalSales.change')}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t('stats.stats.metrics.orders.title')}</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{metrics.orders}</div>
            <p className="text-xs text-gray-500">{t('stats.stats.metrics.orders.change')}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t('stats.stats.metrics.averageCart.title')}</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">€{metrics.averageCart.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{t('stats.stats.metrics.averageCart.change')}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t('stats.stats.metrics.visitors.title')}</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{metrics.visitors}</div>
            <p className="text-xs text-gray-500">{t('stats.stats.metrics.visitors.change')}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`${activeTab === 'sales'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('stats.stats.tabs.sales')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`${activeTab === 'products'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('stats.stats.tabs.products')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`${activeTab === 'customers'
                ? 'border-[#6D28D9] text-[#6D28D9]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            {t('stats.stats.tabs.customers')}
          </button>
        </nav>
      </div>

      {activeTab === 'sales' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">{t('stats.stats.charts.sales.title')}</h2>
            <p className="text-sm text-gray-500">{t('stats.stats.charts.sales.subtitle')}</p>
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
                  formatter={(value) => [`€${value}`, t('stats.stats.charts.sales.tooltip.sales')]}
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
              <h2 className="text-lg font-medium">{t('stats.stats.charts.products.bestSellers.title')}</h2>
              <p className="text-sm text-gray-500">{t('stats.stats.charts.products.bestSellers.subtitle')}</p>
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
                    formatter={(value) => [`${value} ${t('stats.stats.charts.products.bestSellers.tooltip.units')}`, t('stats.stats.charts.products.bestSellers.tooltip.sales')]}
                  />
                  <Bar dataKey="ventes" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium">{t('stats.stats.charts.products.distribution.title')}</h2>
              <p className="text-sm text-gray-500">{t('stats.stats.charts.products.distribution.subtitle')}</p>
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
                    formatter={(value) => [`${value}%`, t('stats.stats.charts.products.distribution.tooltip.percentage')]}
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
            <h2 className="text-lg font-medium">{t('stats.stats.charts.customers.title')}</h2>
            <p className="text-sm text-gray-500">{t('stats.stats.charts.customers.subtitle')}</p>
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
                <Area type="monotone" dataKey="nouveaux" stackId="1" stroke="#6D28D9" fill="#c8c2fd" name={t('stats.stats.charts.customers.tooltip.new')} />
                <Area type="monotone" dataKey="total" stackId="2" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.3} name={t('stats.stats.charts.customers.tooltip.total')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
