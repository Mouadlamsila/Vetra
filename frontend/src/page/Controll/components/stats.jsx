"use client"

import { useState, useEffect } from "react"
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
import { useTranslation } from "react-i18next"
import { ChevronDown } from "lucide-react"
import axios from "axios"

export default function StatsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("sales")
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const lang = localStorage.getItem("lang")

  // State for metrics
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    orders: 0,
    averageCart: 0,
    visitors: 0,
  })

  // State for charts data
  const [salesData, setSalesData] = useState([])
  const [productData, setProductData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [customerData, setCustomerData] = useState([])
  const [translatedCategoryData, setTranslatedCategoryData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("IDUser")
        if (!userId) return

        // Fetch categories
        const categoriesResponse = await axios.get('https://useful-champion-e28be6d32c.strapiapp.com/api/categories')
        const categories = categoriesResponse.data.data

        // Fetch products with categories for the logged-in user
        const productsResponse = await axios.get(
          `https://useful-champion-e28be6d32c.strapiapp.com/api/products?filters[boutique][owner][id][$eq]=${userId}&populate=category`
        )
        const products = productsResponse.data.data

        // Calculate category distribution
        const categoryDistribution = categories.map(category => {
          const productsInCategory = products.filter(product => 
            product.category && product.category.id === category.id
          ).length

          return {
            id: category.id, // Add id for translation
            categorie: category.name,
            valeur: productsInCategory,
            fill: getRandomColor(),
          }
        }).filter(cat => cat.valeur > 0) // Only show categories with products

        setCategoryData(categoryDistribution)

        // Fetch orders for the selected period
        const ordersResponse = await axios.get(
          `https://useful-champion-e28be6d32c.strapiapp.com/api/orders?filters[user][id][$eq]=${userId}&populate=*`,
        )
        const orders = ordersResponse.data.data

        // Calculate metrics
        const totalSales = orders.reduce((sum, order) => sum + Number.parseFloat(order.totalAmount), 0)
        const averageCart = orders.length > 0 ? totalSales / orders.length : 0

        setMetrics({
          totalSales,
          orders: orders.length,
          averageCart,
          visitors: orders.length * 3, // Placeholder for visitors count
        })

        // Generate sales data for the selected period
        const days = Number.parseInt(selectedPeriod)
        const salesData = Array.from({ length: days }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (days - 1 - i))
          const dayOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt)
            return orderDate.toDateString() === date.toDateString()
          })
          const totalSales = dayOrders.reduce((sum, order) => sum + Number.parseFloat(order.totalAmount), 0)
          return {
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            ventes: totalSales,
          }
        })
        setSalesData(salesData)

        // Generate product sales data (top 5)
        const productSales = products
          .map((product) => ({
            produit: product.name,
            ventes: Math.floor(Math.random() * 100), // Placeholder for actual sales count
          }))
          .sort((a, b) => b.ventes - a.ventes)
          .slice(0, 5)
        setProductData(productSales)

        // Generate customer data
        const customerData = Array.from({ length: days }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (days - 1 - i))
          const dayOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt)
            return orderDate.toDateString() === date.toDateString()
          })
          return {
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            nouveaux: dayOrders.length,
            total: orders.filter((order) => new Date(order.createdAt) <= date).length,
          }
        })
        setCustomerData(customerData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [selectedPeriod])

  // --- CATEGORY TRANSLATION LOGIC ---
  // Helper to get translation from Lingva Translate
  const translateCategory = async (text, targetLang) => {
    try {
      const response = await axios.get(
        `https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`
      );
      if (response.data && response.data.translation) {
        return response.data.translation;
      }
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // Get translated category name (with caching)
  const getTranslatedCategoryName = async (cat) => {
    const lang = localStorage.getItem('lang') || 'en';
    if (!cat?.name || lang === 'en') return cat?.name || '';
    // Use localStorage cache
    let cache = {};
    try {
      cache = JSON.parse(localStorage.getItem('categoryTranslations') || '{}');
    } catch (e) {
      cache = {};
    }
    if (!cat.id) return cat.name;
    if (!cache[cat.id]) cache[cat.id] = {};
    if (cache[cat.id][lang]) {
      return cache[cat.id][lang];
    }
    // Not cached, fetch translation
    const translated = await translateCategory(cat.name, lang);
    // Only cache if translation is different
    if (translated && translated !== cat.name) {
      cache[cat.id][lang] = translated;
      localStorage.setItem('categoryTranslations', JSON.stringify(cache));
      return translated;
    } else {
      // Fallback to original name
      return cat.name;
    }
  };

  // Effect to translate categoryData when it changes or language changes
  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'en';
    if (lang === 'en' || categoryData.length === 0) {
      setTranslatedCategoryData(categoryData);
      return;
    }
    let isMounted = true;
    Promise.all(
      categoryData.map(async (cat) => {
        // Use cat.id for translation cache
        return {
          ...cat,
          categorie: await getTranslatedCategoryName({ id: cat.id, name: cat.categorie }),
        };
      })
    ).then((translated) => {
      if (isMounted) setTranslatedCategoryData(translated);
    });
    return () => { isMounted = false; };
  }, [categoryData, localStorage.getItem('lang')]);

  const getRandomColor = () => {
    const colors = ["#6D28D9", "#1e3a8a", "#c8c2fd", "#9061f9"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("stats.stats.title")}</h1>
          <p className="text-sm sm:text-base text-gray-500">{t("stats.stats.subtitle")}</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full relative sm:w-[180px] py-2 px-4 appearance-none rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
          >
            <option value="7">{t("stats.stats.period.options.last7Days")}</option>
            <option value="30">{t("stats.stats.period.options.last30Days")}</option>
            <option value="90">{t("stats.stats.period.options.last3Months")}</option>
            <option value="365">{t("stats.stats.period.options.last12Months")}</option>
          </select>
          <div
            className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center pointer-events-none`}
          >
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t("stats.stats.metrics.totalSales.title")}</h3>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold">€{metrics.totalSales.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{t("stats.stats.metrics.totalSales.change")}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t("stats.stats.metrics.orders.title")}</h3>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold">{metrics.orders}</div>
            <p className="text-xs text-gray-500">{t("stats.stats.metrics.orders.change")}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t("stats.stats.metrics.averageCart.title")}</h3>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold">€{metrics.averageCart.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{t("stats.stats.metrics.averageCart.change")}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{t("stats.stats.metrics.visitors.title")}</h3>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold">{metrics.visitors}</div>
            <p className="text-xs text-gray-500">{t("stats.stats.metrics.visitors.change")}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            className={`${
              activeTab === "sales"
                ? "border-[#6D28D9] text-[#6D28D9]"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap border-b-2 py-3 sm:py-4 px-1 text-sm font-medium`}
          >
            {t("stats.stats.tabs.sales")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`${
              activeTab === "products"
                ? "border-[#6D28D9] text-[#6D28D9]"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap border-b-2 py-3 sm:py-4 px-1 text-sm font-medium`}
          >
            {t("stats.stats.tabs.products")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("customers")}
            className={`${
              activeTab === "customers"
                ? "border-[#6D28D9] text-[#6D28D9]"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap border-b-2 py-3 sm:py-4 px-1 text-sm font-medium`}
          >
            {t("stats.stats.tabs.customers")}
          </button>
        </nav>
      </div>

      {activeTab === "sales" && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-medium">{t("stats.stats.charts.sales.title")}</h2>
            <p className="text-xs sm:text-sm text-gray-500">{t("stats.stats.charts.sales.subtitle")}</p>
          </div>
          <div className="h-72 sm:h-80 md:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={salesData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} height={40} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `€${value}`} tickMargin={10} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                  formatter={(value) => [`€${value}`, t("stats.stats.charts.sales.tooltip.sales")]}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
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

      {activeTab === "products" && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-medium">{t("stats.stats.charts.products.bestSellers.title")}</h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {t("stats.stats.charts.products.bestSellers.subtitle")}
              </p>
            </div>
            <div className="h-72 sm:h-80 md:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="produit"
                    tick={{ fontSize: 10 }}
                    tickMargin={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10 }} tickMargin={10} width={40} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                    }}
                    formatter={(value) => [
                      `${value} ${t("stats.stats.charts.products.bestSellers.tooltip.units")}`,
                      t("stats.stats.charts.products.bestSellers.tooltip.sales"),
                    ]}
                  />
                  <Bar dataKey="ventes" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-medium">
                {t("stats.stats.charts.products.distribution.title")}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {t("stats.stats.charts.products.distribution.subtitle")}
              </p>
            </div>
            <div className="h-72 sm:h-80 md:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={translatedCategoryData.length > 0 ? translatedCategoryData : categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={({ viewBox }) => Math.min(viewBox.width, viewBox.height) / 3}
                    dataKey="valeur"
                    nameKey="categorie"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                    }}
                    formatter={(value) => [
                      `${value} ${t("stats.stats.charts.products.distribution.tooltip.products")}`,
                      t("stats.stats.charts.products.distribution.tooltip.count"),
                    ]}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      paddingLeft: 20,
                      fontSize: 12,
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-medium">{t("stats.stats.charts.customers.title")}</h2>
            <p className="text-xs sm:text-sm text-gray-500">{t("stats.stats.charts.customers.subtitle")}</p>
          </div>
          <div className="h-72 sm:h-80 md:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} height={40} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} tickMargin={10} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Area
                  type="monotone"
                  dataKey="nouveaux"
                  stackId="1"
                  stroke="#6D28D9"
                  fill="#c8c2fd"
                  name={t("stats.stats.charts.customers.tooltip.new")}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stackId="2"
                  stroke="#1e3a8a"
                  fill="#1e3a8a"
                  fillOpacity={0.3}
                  name={t("stats.stats.charts.customers.tooltip.total")}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
