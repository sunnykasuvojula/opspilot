import axios from "axios";

const api=axios.create({
    baseURL:"/",
});

// 🔐 Request interceptor (attach JWT) to every request sent from my frontend
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("opspilot_token");
    if(token)
    {
        config.headers.Authorization=`Bearer ${token}`;
    }

    return config 
})

// 🚨 Response interceptor (auto logout on 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("opspilot_token");
        localStorage.removeItem("opspilot_user");
        localStorage.removeItem("opspilot_workspace");
        localStorage.removeItem("opspilot_membership");
  
        if (window.location.pathname.startsWith("/app")) {
          window.location.href = "/login";
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  export default api;
  