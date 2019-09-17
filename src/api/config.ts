import axios from "axios"

export const baseUrl = "http://123.207.96.7:3555"

// axios的实例及拦截器配置
const axiosInstance = axios.create({
  baseURL: baseUrl,
})

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    console.log(err, "网络错误")
  }
)

export { axiosInstance }
