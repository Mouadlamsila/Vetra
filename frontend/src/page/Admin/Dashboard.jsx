"use client"

import { useState, useEffect } from "react"
import { Users, Store, ShoppingBag, DollarSign, ArrowUp, ArrowDown, Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import axios from "axios"

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    users: 0,
    stores: 0,
    products: 0,
    revenue: 0,
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [dailyData, setDailyData] = useState([])
  const [productDistributionData, setProductDistributionData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [userPhotos, setUserPhotos] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState("monthly")
  const [selectedTimeRange, setSelectedTimeRange] = useState("30")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users count
        const usersResponse = await axios.get('http://localhost:1337/api/users/count')
        
        // Fetch stores count using pagination metadata
        const storesResponse = await axios.get('http://localhost:1337/api/boutiques?pagination[pageSize]=1')
        
        // Fetch products count using pagination metadata
        const productsResponse = await axios.get('http://localhost:1337/api/products?pagination[pageSize]=1')
        
        // Fetch recent orders (last 5)
        const ordersResponse = await axios.get('http://localhost:1337/api/orders?sort=createdAt:desc&limit=5&populate=*')
        
        // Fetch user photos for recent orders
        const userPhotosData = {}
        for (const order of ordersResponse.data.data) {
          if (order.customer?.id) {
            try {
              const userResponse = await axios.get(`http://localhost:1337/api/users/${order.customer.id}?populate=photo`)
              if (userResponse.data.photo) {
                userPhotosData[order.customer.id] = userResponse.data.photo
              }
            } catch (err) {
              console.error(`Error fetching user photo for ID ${order.customer.id}:`, err)
            }
          }
        }
        setUserPhotos(userPhotosData)
        
        // Fetch all orders for charts
        const ordersData = await axios.get('http://localhost:1337/api/orders?populate=*')
        
        // Calculate total revenue from orders
        const totalRevenue = ordersData.data.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        
        // Process orders for charts
        const orders = ordersData.data.data
        
        // Filter orders based on selected time range
        const now = new Date()
        const filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt)
          const diffTime = Math.abs(now - orderDate)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          switch(selectedTimeRange) {
            case "7":
              return diffDays <= 7
            case "30":
              return diffDays <= 30
            case "90":
              return diffDays <= 90
            case "365":
              return diffDays <= 365
            default:
              return true
          }
        })
        
        // Generate chart data based on selected time range
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
        const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        
        let last7Days, last30Days, last3Months, yearlyData, defaultMonthlyData

        switch(selectedTimeRange) {
          case "7":
            // Weekly data for last 7 days
            last7Days = weekDays.map((day, index) => {
              const dayOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.getDay() === (index + 1) % 7
              })
              const total = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
              return {
                name: day,
                sales: total
              }
            })
            setWeeklyData(last7Days)
            setTimeRange("weekly")
            break

          case "30":
            // Daily data for last 30 days
            last30Days = Array.from({ length: 30 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - i)
              const dayOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.toDateString() === date.toDateString()
              })
              const total = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
              return {
                name: date.getDate().toString(),
                sales: total
              }
            }).reverse()
            setDailyData(last30Days)
            setTimeRange("daily")
            break

          case "90":
            // Monthly data for last 3 months
            last3Months = months.slice(-3).map(month => {
              const monthIndex = months.indexOf(month)
              const monthOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.getMonth() === monthIndex
              })
              const total = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
              return {
                name: month,
                sales: total
              }
            })
            setMonthlyData(last3Months)
            setTimeRange("monthly")
            break

          case "365":
            // Monthly data for entire year
            yearlyData = months.map(month => {
              const monthIndex = months.indexOf(month)
              const monthOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.getMonth() === monthIndex
              })
              const total = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
              return {
                name: month,
                sales: total
              }
            })
            setMonthlyData(yearlyData)
            setTimeRange("monthly")
            break

          default:
            // Default to monthly data
            defaultMonthlyData = months.map(month => {
              const monthIndex = months.indexOf(month)
              const monthOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.getMonth() === monthIndex
              })
              const total = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
              return {
                name: month,
                sales: total
              }
            })
            setMonthlyData(defaultMonthlyData)
            setTimeRange("monthly")
        }
        
        // Fetch product distribution by category
        const productsWithCategoriesResponse = await axios.get('http://localhost:1337/api/products?populate=*')
        
        // Process product distribution data
        const categoryCount = {}
        productsWithCategoriesResponse.data.data.forEach(product => {
          if (product.categories) {
            categoryCount[product.categories] = (categoryCount[product.categories] || 0) + 1
          }
        })
        
        const distributionData = Object.entries(categoryCount).map(([name, value]) => ({
          name,
          value: (value / productsWithCategoriesResponse.data.data.length) * 100,
          color: COLORS[Object.keys(categoryCount).indexOf(name) % COLORS.length]
        }))

        // Update state with fetched data
        setDashboardStats({
          users: usersResponse.data,
          stores: storesResponse.data.meta.pagination.total,
          products: productsResponse.data.meta.pagination.total,
          revenue: totalRevenue,
        })
        
        setProductDistributionData(distributionData)
        setRecentOrders(ordersResponse.data.data)
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedTimeRange])

const COLORS = ["#1e3a8a", "#10b981", "#f59e0b", "#ef4444", "#6D28D9"]

  const StatsCard = ({ title, value, percentChange, icon, iconColor }) => {
  const isPositive = percentChange >= 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
          <div className={`flex items-center mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span className="text-xs font-medium">{Math.abs(percentChange)}% cette semaine</span>
          </div>
        </div>
          <div className={` ${iconColor}  `}>{icon}</div>
      </div>
    </div>
  )
}

const SalesChart = () => {
  const chartData = timeRange === "monthly" ? monthlyData : timeRange === "weekly" ? weeklyData : dailyData

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Croissance des ventes</h3>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              timeRange === "monthly" ? "bg-[#c8c2fd] text-[#6D28D9]" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setTimeRange("monthly")}
          >
            Mensuelle
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              timeRange === "weekly" ? "bg-[#c8c2fd] text-[#6D28D9]" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setTimeRange("weekly")}
          >
            Hebdomadaire
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              timeRange === "daily" ? "bg-[#c8c2fd] text-[#6D28D9]" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setTimeRange("daily")}
          >
            Journalière
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                interval={timeRange === "daily" ? 4 : 0} // Show fewer labels for daily view
              />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value) => `€${value}`}
            />
            <RechartsTooltip
              formatter={(value) => [`€${value}`, "Ventes"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6D28D9"
              strokeWidth={2}
              dot={{ stroke: "#6D28D9", strokeWidth: 2, r: 4, fill: "#ffffff" }}
              activeDot={{ r: 6, stroke: "#6D28D9", strokeWidth: 2, fill: "#ffffff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const ProductDistributionChart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Distribution des produits</h3>
      </div>
      <div className="h-[300px]">
          
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={productDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {productDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip
                formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            />
            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: "20px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

  const RecentOrders = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Commandes récentes</h3>
          <button 
            className="text-[#6D28D9] text-sm font-medium hover:text-[#5b21b6]"
            onClick={() => window.location.href = '/admin/orders'}
          >
            Voir tout
          </button>
      </div>
      <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                {userPhotos[order.customer?.id] ? (
                  <img 
                    src={`http://localhost:1337${userPhotos[order.customer.id].url}`}
                    alt={order.customer.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#c8c2fd] flex items-center justify-center text-[#6D28D9]">
                    <span className="text-sm font-medium">{order.customer?.username?.charAt(0) || 'C'}</span>
                  </div>
                )}
            </div>
            <div>
              <p className="text-sm">
                  <span className="font-medium">{order.customer?.username || 'Client'}</span> a passé une commande de{' '}
                  <span className="font-medium">{order.totalAmount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-500">Vue d'ensemble des performances de la marketplace</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <select 
            className="border border-gray-300 rounded-md px-3 py-2"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="30">Derniers 30 jours</option>
            <option value="7">Derniers 7 jours</option>
            <option value="90">Ce trimestre</option>
            <option value="365">Cette année</option>
          </select>
          <button className="p-2 border border-gray-300 rounded-md">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Utilisateurs"
          value={dashboardStats.users}
          percentChange={12.5}
          icon={<Users className="h-10 w-15 bg-[#c8c2fd] rounded-full p-3" />}
          iconColor="text-[#6D28D9]"
        />
        <StatsCard
          title="Boutiques"
          value={dashboardStats.stores}
          percentChange={7.2}
          icon={<Store className="h-10 w-15 bg-[#c8c2fd] rounded-full p-3" />}
          iconColor="text-[#6D28D9]"
        />
        <StatsCard
          title="Produits"
          value={dashboardStats.products}
          percentChange={18.3}
          icon={<ShoppingBag className="h-10 w-15 bg-[#c8c2fd] rounded-full p-3" />}
          iconColor="text-[#6D28D9]"
        />
        <StatsCard
          title="Revenus"
          value={dashboardStats.revenue}
          percentChange={-3.4}
          icon={<DollarSign className="h-10 w-15 bg-[#c8c2fd] rounded-full p-3" />}
          iconColor="text-[#6D28D9]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart />
        <ProductDistributionChart />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  )
}
