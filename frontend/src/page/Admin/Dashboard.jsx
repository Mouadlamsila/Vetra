import { Users, Store, ShoppingBag, DollarSign, ArrowUp, ArrowDown, Download } from "lucide-react"

// Mock data for the dashboard
const dashboardStats = {
  users: 2458,
  stores: 85,
  products: 1204,
  revenue: 28456.78,
}

const StatsCard = ({ title, value, percentChange, icon, iconBgColor, iconColor }) => {
  const isPositive = percentChange >= 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className={`flex items-center mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span className="text-xs font-medium">{Math.abs(percentChange)}% cette semaine</span>
          </div>
        </div>
        <div className={`${iconBgColor} ${iconColor} rounded-full p-3`}>{icon}</div>
      </div>
    </div>
  )
}

const SalesChart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Ventes</h3>
        <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
          <option>Ce trimestre</option>
        </select>
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Graphique des ventes</p>
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
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Graphique de distribution</p>
      </div>
    </div>
  )
}

const RecentActivities = () => {
  const activities = [
    { id: 1, user: "Thomas Dubois", action: "a ajouté un nouveau produit", time: "Il y a 2 heures" },
    { id: 2, user: "Marie Laurent", action: "a créé une nouvelle boutique", time: "Il y a 5 heures" },
    { id: 3, user: "Admin", action: "a modifié les paramètres", time: "Il y a 1 jour" },
    { id: 4, user: "Sophie Lefèvre", action: "a répondu à un ticket de support", time: "Il y a 1 jour" },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Activités récentes</h3>
        <button className="text-purple-600 text-sm font-medium">Voir tout</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span className="text-xs font-medium text-gray-600">{activity.user.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-500">Vue d'ensemble des performances de la marketplace</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <select className="border border-gray-300 rounded-md px-3 py-2">
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
          value={dashboardStats.users.toLocaleString()}
          percentChange={12.5}
          icon={<Users className="h-6 w-6" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Boutiques"
          value={dashboardStats.stores.toLocaleString()}
          percentChange={7.2}
          icon={<Store className="h-6 w-6" />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Produits"
          value={dashboardStats.products.toLocaleString()}
          percentChange={18.3}
          icon={<ShoppingBag className="h-6 w-6" />}
          iconBgColor="bg-green-50"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Revenus"
          value={formatCurrency(dashboardStats.revenue)}
          percentChange={-3.4}
          icon={<DollarSign className="h-6 w-6" />}
          iconBgColor="bg-yellow-50"
          iconColor="text-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart />
        <ProductDistributionChart />
      </div>

      {/* Recent Activity */}
      <RecentActivities />
    </div>
  )
}
