const statsFr = {
  stats: {
    title: "Statistiques",
    subtitle: "Analysez les performances de vos boutiques",
    period: {
      title: "Période",
      options: {
        last7Days: "7 derniers jours",
        last30Days: "30 derniers jours",
        last3Months: "3 derniers mois",
        last12Months: "12 derniers mois"
      }
    },
    metrics: {
      totalSales: {
        title: "Ventes totales",
        value: "€4,550.50",
        change: "+12.5% par rapport au mois dernier"
      },
      orders: {
        title: "Commandes",
        value: "45",
        change: "+8.2% par rapport au mois dernier"
      },
      averageCart: {
        title: "Panier moyen",
        value: "€101.12",
        change: "+3.1% par rapport au mois dernier"
      },
      visitors: {
        title: "Visiteurs",
        value: "1,245",
        change: "+18.7% par rapport au mois dernier"
      }
    },
    tabs: {
      sales: "Ventes",
      products: "Produits",
      customers: "Clients"
    },
    charts: {
      sales: {
        title: "Ventes par jour",
        subtitle: "Évolution des ventes sur les 30 derniers jours",
        tooltip: {
          sales: "Ventes"
        }
      },
      products: {
        bestSellers: {
          title: "Meilleurs produits",
          subtitle: "Produits les plus vendus",
          tooltip: {
            units: "unités",
            sales: "Ventes"
          }
        },
        distribution: {
          title: "Répartition des ventes",
          subtitle: "Par catégorie de produit",
          tooltip: {
            percentage: "Pourcentage"
          }
        }
      },
      customers: {
        title: "Acquisition de clients",
        subtitle: "Nouveaux clients par jour",
        tooltip: {
          new: "Nouveaux",
          total: "Total"
        }
      }
    }
  }
};

export default statsFr; 