/**
 * 作者：yujinjin9@126.com
 * 时间：2018-09-13
 * 描述：交互式数据请求
 */
import axios from "axios";
import globalService from "@js/services/global-service";

export default function() {
	// 自定义非axios的配置
	let customer_options = {
		// 是否让框架自动显示错误提示信息
		isShowError: true,
		//是否处理返回的response数据，默认系统框架会处理数据
		isResultData: true,
		// 是否显示loading加载
		isShowLoading: false
	};

	// 自定义拦截器配置
	let customer_interceptor = {
		before: function(ajaxConfig) {
			return Promise.resolve(true);
		}, // 开始请求数据时的函数，返回Promise,如果是false就不再去请求数据
		request: {
			// 在发送请求之前的函数
			before: function(axiosConfig) {
				//在发送请求之前做某事
				if (globalService.getLoginUserToken()) {
					axiosConfig.headers["Authorization"] = globalService.getLoginUserToken();
				}
				//如果配置传入显示加载选项就显示加载项
				if (axiosConfig.isShowLoading === true) {
					axiosConfig.showLoadingTimerId = setTimeout(() => {
						axiosConfig.showLoadingTimerId = null;
						site.showLoading();
					}, 300);
				}
				return axiosConfig;
			},
			// 在发送请求之前的error函数
			error: function(error) {
				if (error.config) {
					// 直接JSON error对象在app环境中会报错，现在只能做config、xhr实例
					site.log.error("接口出错:" + JSON.stringify({ config: error.config }));
				}
				//请求错误时做些事
				return Promise.reject(error);
			}
		},
		response: {
			// 在响应请求数据的函数
			before: function(response) {
				//对响应数据做些事
				//如果配置传入显示加载选项就显示加载项
				if (response.config.isShowLoading === true) {
					if (response.config.showLoadingTimerId) {
						clearTimeout(response.config.showLoadingTimerId);
					} else {
						site.hideLoading();
					}
				}
				if (response.data) {
					if (response.config.isResultData && response.data.success === true) {
						return response.data.data;
					}
					if (response.config.isShowError && response.data.success === false) {
						site.message({
							message: (response.data.error && response.data.error.message) || "很抱歉，同时访问的人数过多，请稍后再试~",
							type: "error"
						});
						site.log.error("接口出错:" + JSON.stringify(response.data.error));
					}
					if (response.config.isResultData && response.data.success === false) {
						return Promise.reject(response.data);
					}
				}
				return response.data;
			},
			// 在发送请求数据的error函数
			error: function(error) {
				//请求错误时做些事
				const xhr = error.response && error.response.data;
				if (error.config.isShowError) {
					let errorMessage = "";
					if (xhr.error) {
						if (xhr.error.message) {
							errorMessage = xhr.error.message;
						} else if (xhr.error.validationErrors && xhr.error.validationErrors.length > 0) {
							xhr.error.validationErrors.forEach(errorItem => {
								errorMessage += validationErrors[i].message + " ";
							});
						}
					}
					if (!errorMessage) {
						switch (error.request.status) {
							case 401:
							case 403:
								errorMessage = "当前账户信息有问题，请重新登录";
								break;
							case 404:
								errorMessage = "没有找到该请求接口!";
								break;
							case 405:
								errorMessage = "请求的资源不支持!";
								break;
							case 500:
							case 502:
								let response = error.request.response;
								errorMessage = (response && response.data.error && (response.data.error.details || response.data.error.message)) || "服务器出错";
								break;
							case 503:
								errorMessage = "哦～服务器宕机了";
								break;
							default:
								errorMessage = "内部服务错误！";
								break;
						}
					}
					site.message({
						message: errorMesg,
						type: "error"
					});
				}
				if (typeof error.config.error === "function") {
					error.config.error(error);
				}
				//如果配置传入显示加载选项就显示加载项
				if (error.config.isShowLoading === true) {
					if (response.config.showLoadingTimerId) {
						clearTimeout(response.config.showLoadingTimerId);
					} else {
						site.hideLoading();
					}
				}
				if (error.config) {
					// 直接JSON error对象在app环境中会报错，现在只能做config、xhr实例
					site.log.error("接口出错:" + JSON.stringify({ config: error.config, data: xhr }));
				}
				return Promise.reject(error);
			}
		}
	};

	// 自定义axios配置
	let customer_axios_options = {
		// 将被添加到`url`前面，除非`url`是绝对的。
		baseURL: config.webApiDomain,
		//是发出请求时使用的请求方法
		method: "GET",
		//请求超时时间
		timeout: 60000,
		//服务器返回的数据类型
		responseType: "json",
		//定义允许的http响应内容的最大大小
		maxContentLength: 200000,
		transformRequest: [
			function(data, headers) {
				if (!data) {
					return data;
				}
				if (headers["Content-Type"] == "application/x-www-form-urlencoded") {
					// 将数据转换为表单数据
					let formData = [];
					for (let key in data) {
						formData.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
					}
					return formData.join("&");
				} else if (headers["Content-Type"].indexOf("multipart/form-data") != -1) {
					return data;
				}
				return JSON.stringify(data);
			}
		],
		// 允许返回的数据传入then/catch之前进行处理
		// transformResponse: [
		// 	function(data) {
		// 		return data;
		// 	}
		// ],
		// `auth'表示应该使用 HTTP 基本认证，并提供凭据。
		// 这将设置一个`Authorization'头，覆盖任何现有的`Authorization'自定义头，使用`headers`设置。
		//auth: {},
		//指示是否跨站点访问控制请求,应该是用证书
		withCredentials: false,
		validateStatus: function(status) {
			return status >= 200 && status < 300; // default
		},
		//作为请求主体发送的数据,仅适用于请求方法“PUT”，“POST”和“PATCH”
		// data: {},
		//作为get请求数据参数对象
		params: {},
		//要发送的自定义 headers,{'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded'},
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
			"Access-Control-Allow-Origin": "*"
		}
	};

	const instance = axios.create(customer_axios_options);

	//添加请求拦截器
	instance.interceptors.request.use(
		function(axiosConfig) {
			if (customer_interceptor.request && customer_interceptor.request.before) {
				return customer_interceptor.request.before(axiosConfig);
			}
			return axiosConfig;
		},
		function(error) {
			if (customer_interceptor.request && customer_interceptor.request.error) {
				return customer_interceptor.request.error(error);
			}
			return error;
		}
	);

	//添加响应拦截器
	instance.interceptors.response.use(
		function(response) {
			if (customer_interceptor.response && customer_interceptor.response.before) {
				return customer_interceptor.response.before(response);
			}
			return response;
		},
		function(error) {
			if (customer_interceptor.response && customer_interceptor.response.error) {
				return customer_interceptor.response.error(error);
			}
		}
	);

	let ajax = function(ajaxConfig) {
		// 处理自定义参数
		if (ajaxConfig.inputData) {
			if (!ajaxConfig.method || ajaxConfig.method.toLowerCase() === "get") {
				ajaxConfig.params = Object.assign({}, ajaxConfig.params || {}, ajaxConfig.inputData);
			} else if (ajaxConfig.method.toLowerCase() == "post") {
				ajaxConfig.data = Object.assign({}, ajaxConfig.data || {}, ajaxConfig.inputData);
			}
			delete ajaxConfig.inputData;
		}
		return instance(Object.assign({}, customer_options, ajaxConfig));
	};

	ajax.axios = axios;
	return ajax;
}
