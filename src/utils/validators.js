export const formatCNPJ = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const validateCNPJ = (cnpj) => {
  const c = (cnpj || "").replace(/\D/g, "");
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;

  const calc = (base) => {
    let pos = base.length - 7;
    let soma = 0;
    for (let i = base.length; i >= 1; i--) {
      soma += Number(base.charAt(base.length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    return soma % 11 < 2 ? 0 : 11 - (soma % 11);
  };

  const d1 = calc(c.substring(0, 12));
  const d2 = calc(c.substring(0, 13));
  return d1 === Number(c.charAt(12)) && d2 === Number(c.charAt(13));
};

export const formatPhone = (value) => {
  const d = (value || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());