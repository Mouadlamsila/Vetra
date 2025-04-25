import { ChartColumn, DollarSign, Package, ShoppingBag, Store } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"   
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BoardTable() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        stores: 0,
        products: 0,
        orders: 0,
        sales: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('IDUser');
                if (!userId) return;

                // Fetch stores
                const storesResponse = await axios.get(`http://localhost:1337/api/boutiques?filters[owner][id][$eq]=${userId}`);
                const stores = storesResponse.data.data;
                console.log(stores);
                // Fetch products
                const productsResponse = await axios.get(`http://localhost:1337/api/products?filters[boutique][owner][id][$eq]=${userId}`);
                const products = productsResponse.data.data;

                // Fetch orders
                const ordersResponse = await axios.get(`http://localhost:1337/api/orders?filters[customer][id][$eq]=${userId}&populate=*`);
                const orders = ordersResponse.data.data;

                // Calculate total sales
                const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

                // Get recent orders
                const recentOrdersData = orders.slice(0, 5).map(order => ({
                    numCommand: order.id,
                    heures: Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60 * 60)),
                    price: order.totalAmount
                }));

                // Generate sales data for the last 30 days
                const salesData = Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
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

                setStats({
                    stores: stores.length,
                    products: products.length,
                    orders: orders.length,
                    sales: totalSales
                });
                setRecentOrders(recentOrdersData);
                setSalesData(salesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const card = [
        {
            title: t('dashboard.stores'),
            description: t('dashboard.storesDescription'),
            value: stats.stores,
            icon: <Store />
        },
        {
            title: t('dashboard.products'),
            description: t('dashboard.productsDescription'),
            value: stats.products,
            icon: <Package />
        },
        {
            title: t('dashboard.orders'),
            description: t('dashboard.ordersDescription'),
            value: stats.orders,
            icon: <ShoppingBag />
        },
        {
            title: t('dashboard.sales'),
            description: t('dashboard.salesDescription'),
            value: `€${stats.sales.toFixed(2)}`,
            icon: <ChartColumn />
        }
    ];

    return (
        <div className="p-5 space-y-5">
            <div className="space-y-1">
                <h1 className="text-4xl font-bold">{t('dashboard.title')}</h1>
                <p className="text-sm  text-gray-500">{t('dashboard.welcome')}</p>
            </div>
            <div className="flex justify-center ">
                <div className="grid gap-2  w-[100%] grid-cols-4">
                    {card.map((item, index) => (
                        <div key={index} className="bg-white border py-7 border-[#c8c2fd]  shadow rounded-lg px-5">
                            <div className=" w-full  gap-2">
                                <div className="flex justify-between">
                                    <h2 className="text-sm font-medium">{item.title}</h2>
                                    <div className="text-[#6D28D9]">{item.icon}</div>
                                </div>
                                <p className="text-2xl font-bold">{item.value}</p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid w-full grid-cols-[59.5%_39.5%] gap-[1%]">
                <div className="bg-white border border-[#c8c2fd]  shadow rounded-lg ">
                    <div className="p-5">
                        <h1 className="text-2xl font-bold">{t('dashboard.salesOverview')}</h1>
                        <p className="text-sm text-gray-500">{t('dashboard.last30Days')}</p>
                    </div>
                    <div className="h-[1px] bg-[#c8c2fd] w-full"></div>
                    <div className="h-[300px] w-full">
                        <div className="h-80 p-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={salesData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <defs>
                                        <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#c8c2fd" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        tickMargin={10}
                                        tickFormatter={(value, index) => (index % 5 === 0 ? value : "")}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `€${value}`}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            borderColor: "#e5e7eb",
                                            borderRadius: "0.375rem",
                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                        }}
                                        formatter={(value) => [`€${value}`, t('dashboard.sales')]}
                                        labelStyle={{ fontWeight: "bold" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="ventes"
                                        stroke="#6D28D9"
                                        strokeWidth={2}
                                        fill="url(#colorVentes)"
                                        activeDot={{ r: 6, fill: "#1e3a8a" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-[#c8c2fd]  shadow rounded-lg ">
                    <div className="p-5">
                        <h1 className="text-2xl font-bold">{t('dashboard.recentOrders')}</h1>
                        <p className="text-sm text-gray-500">{t('dashboard.last5Orders')}</p>
                    </div>
                    <div className="h-[1px] bg-[#c8c2fd] w-full"></div>
                    <div className="h-[300px] grid gap-1 px-4 py-2 w-full">
                        {recentOrders.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#c8c2fd]/30 text-[#6D28D9] rounded-full flex items-center justify-center">
                                        <ShoppingBag className="size-4" />
                                    </div>
                                    <div className="">
                                        <p className="text-sm font-medium">{t('dashboard.order')} #{item.numCommand}</p>
                                        <p className="text-sm text-gray-500">{t('dashboard.hoursAgo', { hours: item.heures })}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium">€{item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
