import { ChartColumn, DollarSign, Package, ShoppingBag, Store } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"   

export default function BoardTable() {
    const card = [
        {
            title: 'Boutiques',
            description: '2 actives, 1 en attente',
            value: 3,
            icon: <Store />
        },
        {
            title: 'Produits',
            description: '+2 cette semaine',
            value: 24,
            icon: <Package />
        },
        {
            title: 'Commandes',
            description: '3 en attentes',
            value: 12,
            icon: <ShoppingBag />
        },
        {
            title: 'Ventes',
            description: '+18% ce mois',
            value: "€1,250",
            icon: <ChartColumn />
        }
    ]
    const commande = [
        {
            numCommand: 1001,
            heures: 1,
            price: 84.22
        },
        {
            numCommand: 1001,
            heures: 2,
            price: 84.22
        },
        {
            numCommand: 1001,
            heures: 3,
            price: 84.22
        },
        {
            numCommand: 1001,
            heures: 4,
            price: 84.22
        },
        {
            numCommand: 1001,
            heures: 5,
            price: 84.22
        }
    ]
    return (
        <div className="p-5 space-y-5">
            <div className="space-y-1">
                <h1 className="text-4xl font-bold">Tableau de bord</h1>
                <p className="text-sm  text-gray-500">Bienvenue sur votre tableau de bord e-commerce</p>
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
                        <h1 className="text-2xl font-bold">Aperçu des ventes</h1>
                        <p className="text-sm text-gray-500">Ventes des 30 derniers jours</p>
                    </div>
                    <div className="h-[1px] bg-[#c8c2fd] w-full"></div>
                    <div className="h-[300px] w-full">
                        <div className="h-80 p-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={[
                                        { date: "01/04", ventes: 420 },
                                        { date: "02/04", ventes: 380 },
                                        { date: "03/04", ventes: 450 },
                                        { date: "04/04", ventes: 520 },
                                        { date: "05/04", ventes: 480 },
                                        { date: "06/04", ventes: 550 },
                                        { date: "07/04", ventes: 590 },
                                        { date: "08/04", ventes: 620 },
                                        { date: "09/04", ventes: 670 },
                                        { date: "10/04", ventes: 720 },
                                        { date: "11/04", ventes: 650 },
                                        { date: "12/04", ventes: 700 },
                                        { date: "13/04", ventes: 750 },
                                        { date: "14/04", ventes: 780 },
                                        { date: "15/04", ventes: 820 },
                                        { date: "16/04", ventes: 880 },
                                        { date: "17/04", ventes: 840 },
                                        { date: "18/04", ventes: 910 },
                                        { date: "19/04", ventes: 950 },
                                        { date: "20/04", ventes: 1020 },
                                        { date: "21/04", ventes: 980 },
                                        { date: "22/04", ventes: 1050 },
                                        { date: "23/04", ventes: 1100 },
                                        { date: "24/04", ventes: 1150 },
                                        { date: "25/04", ventes: 1200 },
                                        { date: "26/04", ventes: 1180 },
                                        { date: "27/04", ventes: 1220 },
                                        { date: "28/04", ventes: 1250 },
                                        { date: "29/04", ventes: 1300 },
                                        { date: "30/04", ventes: 1250 },
                                    ]}
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
                                        formatter={(value) => [`€${value}`, "Ventes"]}
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
                        <h1 className="text-2xl font-bold">Commandes récentes</h1>
                        <p className="text-sm text-gray-500">Les 5 dernières commandes</p>
                    </div>
                    <div className="h-[1px] bg-[#c8c2fd] w-full"></div>
                    <div className="h-[300px] grid gap-1 px-4 py-2 w-full">
                        {commande.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#c8c2fd]/30 text-[#6D28D9] rounded-full flex items-center justify-center"><ShoppingBag className="size-4" /></div>

                                    <div className="">
                                        <p className="text-sm font-medium">Commande #{item.numCommand}</p>
                                        <p className="text-sm text-gray-500">Il y a {item.heures} heure</p>
                                    </div>

                                </div>
                                <p className="text-sm font-medium">${item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
