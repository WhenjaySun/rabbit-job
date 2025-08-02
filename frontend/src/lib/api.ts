import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

class ApiUtils {
    private baseURL: string = '/api';

    constructor() {
        const instance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 0, //永不超时
            withCredentials: true // 允许携带跨域的 cookie
        });

        // 请求拦截器
        instance.interceptors.request.use(
            (config) => {
                // 在发送请求之前做些什么
                return config;
            },
            (error) => {
                // 对请求错误做些什么
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        instance.interceptors.response.use(
            (response) => {
                // 对响应数据做点什么
                return response;
            },
            (error) => {
                // 对响应错误做点什么
                return Promise.reject(error);
            }
        );

        // 替换类中的请求方法使用自定义实例
        this.get = async <T>(url: string, params?: any, config?: AxiosRequestConfig) => {
            const newConfig = { ...config, params };
            return instance.get<T>(url, newConfig);
        };
        this.post = async (url: string, data?: any, config?: AxiosRequestConfig) => {
            return instance.post(url, data, config);
        };
        this.put = async (url: string, data?: any, config?: AxiosRequestConfig) => {
            return instance.put(url, data, config);
        };
        this.delete = async (url: string, config?: AxiosRequestConfig) => {
            return instance.delete(url, config);
        };
    }

    /**
     * 发送 GET 请求
     * @param url 请求的 URL
     * @param config 请求配置
     * @returns Promise<AxiosResponse>
     */
    async get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        const newConfig = { ...config, params };
        return axios.get<T>(`${this.baseURL}${url}`, newConfig);
    }

    /**
     * 发送 POST 请求
     * @param url 请求的 URL
     * @param data 请求的数据
     * @param config 请求配置
     * @returns Promise<AxiosResponse>
     */
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.post<T>(`${this.baseURL}${url}`, data, config);
    }

    /**
     * 发送 PUT 请求
     * @param url 请求的 URL
     * @param data 请求的数据
     * @param config 请求配置
     * @returns Promise<AxiosResponse>
     */
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.put<T>(`${this.baseURL}${url}`, data, config);
    }

    /**
     * 发送 DELETE 请求
     * @param url 请求的 URL
     * @param config 请求配置
     * @returns Promise<AxiosResponse>
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.delete<T>(`${this.baseURL}${url}`, config);
    }
}

export default new ApiUtils();