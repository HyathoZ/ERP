import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    console.log("Fazendo requisição para:", config.url);
    const token = localStorage.getItem("@erp:token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error("Erro do servidor:", error.response.status, error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem("@erp:token");
        localStorage.removeItem("@erp:user");
        window.location.href = "/login";
      }
      return Promise.reject({
        ...error,
        message: error.response.data?.message || "Erro na requisição",
      });
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("Sem resposta do servidor:", error.request);
      return Promise.reject({
        ...error,
        message: "Servidor não respondeu. Verifique sua conexão.",
      });
    } else {
      // Erro na configuração da requisição
      console.error("Erro na configuração:", error.message);
      return Promise.reject({
        ...error,
        message: "Erro ao fazer requisição. Tente novamente.",
      });
    }
  }
);
