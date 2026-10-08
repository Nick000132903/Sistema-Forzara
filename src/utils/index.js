export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
};

export const formatQuantity = (value, unidade = "") => {
  if (value === undefined || value === null) return "0";
  const formatted = Number(value).toFixed(2);
  return unidade ? `${formatted} ${unidade}` : formatted;
};

export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("pt-BR");
};

export const formatPercent = (value) => {
  if (value === undefined || value === null) return "0%";
  return `${Number(value).toFixed(2)}%`;
};

export const getSortIcon = (field, currentField, direction) => {
  if (field !== currentField) return "⇅";
  return direction === "asc" ? "↑" : "↓";
};

export const sortData = (data, field, direction = "asc") => {
  return [...data].sort((a, b) => {
    let valA, valB;

    switch (field) {
      case "nm_ingrediente":
      case "nm_produto":
      case "nm_categoria":
      case "fornecedor_preferencial":
        valA = (a[field] || "").toLowerCase();
        valB = (b[field] || "").toLowerCase();
        break;
      case "qt_atual":
      case "total_quantidade":
      case "total_valor":
      case "total_pedidos":
      case "vl_custo_medio":
        valA = a[field] || 0;
        valB = b[field] || 0;
        break;
      case "dt_atualizacao":
        valA = a[field] ? new Date(a[field]).getTime() : 0;
        valB = b[field] ? new Date(b[field]).getTime() : 0;
        break;
      default:
        valA = a[field];
        valB = b[field];
    }

    if (typeof valA === "string") {
      return direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return direction === "asc" ? valA - valB : valB - valA;
  });
};

export const filterBySearch = (data, searchTerm, field = "nm_ingrediente") => {
  if (!searchTerm) return data;
  return data.filter((item) =>
    (item[field] || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterByCategory = (data, category, field = "nm_categoria") => {
  if (!category || category === "todas") return data;
  return data.filter((item) => item[field] === category);
};

export const getUniqueCategories = (data, field = "nm_categoria") => {
  return [...new Set(data.map((item) => item[field]).filter(Boolean))];
};

export const getTopThree = (data, valueField = "total_valor") => {
  const colors = ["#8B5CF6", "#A78BFA", "#C4B5FD"];
  return [...data]
    .sort((a, b) => (b[valueField] || 0) - (a[valueField] || 0))
    .slice(0, 3)
    .map((item, index) => ({
      name: item.nm_produto || item.nm_ingrediente || "-",
      value: item[valueField] || 0,
      color: colors[index],
    }));
};

export const calculateVariation = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Normal":
      return "text-emerald-600 bg-emerald-50";
    case "Baixo":
      return "text-yellow-600 bg-yellow-50";
    case "Crítico":
      return "text-red-600 bg-red-50";
    case "Em Falta":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};