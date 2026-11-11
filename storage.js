const storage = {
  get(clave, valorPorDefecto) {
    try {
      const valor = localStorage.getItem(clave);

      if (valor === null) {
        return valorPorDefecto;
      }

      return JSON.parse(valor);
    } catch (error) {
      return valorPorDefecto;
    }
  },

  set(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      return false;
    }
  },
};
