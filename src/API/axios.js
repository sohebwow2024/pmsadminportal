import axios from "axios"
import jwtDefaultConfig from "../../src/@core/auth/jwt/jwtDefaultConfig";
// const BASE_URL = `http://192.168.0.171:5500/api`

// const BASE_URL = `https://pms-api.microhind.com/api`
// export const Image_base_uri = `https://pms-api.microhind.com`
// export const Staah = `https://dev.staah.hostynnist.com/api`


// const BASE_URL = `https://demoserver.hostynnist.com/api`
// export const Image_base_uri = `https://demoserver.hostynnist.com`
// export const Staah = `https://dev.staah.hostynnist.com/api`

// 
// const BASE_URL = `https://devserver.hostynnist.com/api`
const BASE_URL = `https://preprod-pms-api.potenzer.com/api`
export const Image_base_uri = `https://preprod-pms-api.potenzer.com`
export const Staah = `https://dev.staah.hostynnist.com/api`
// export const Image_base_uri = `https://devserver.hostynnist.com`


// NODE_OPTIONS=--max_old_space_size=4096 npm run build ---build command for mac

// const BASE_URL = `https://api.nirmalpalace.hostynnist.com/api`
// export const Image_base_uri = `https://api.nirmalpalace.hostynnist.com`
// export const Staah = `https://dev.staah.hostynnist.com/api`


// const BASE_URL = `https://api.lalitinn.hostynnist.com/api`
// export const Image_base_uri = `https://api.lalitinn.hostynnist.com`
// export const Staah = `https://ota.hostynnist.com/api`


// const BASE_URL = `https://api.redstone.hostynnist.com/api`
// export const Image_base_uri = `https://api.redstone.hostynnist.com`
// export const Staah = `https://ota.hostynnist.com/api`


// const BASE_URL = `https://api.majestic.hostynnist.com/api`
// export const Image_base_uri = `https://api.majestic.hostynnist.com`
// export const Staah = `https://ota.hostynnist.com/api`


// const BASE_URL = `https://api.rgbn.hostynnist.com/api`
// export const Image_base_uri = `https://api.rgbn.hostynnist.com`
// export const Staah = `https://ota.hostynnist.com/api`


// const BASE_URL = `https://pms.microhind.com/api`
// export const Image_base_uri = `https://pms.microhind.com`
// export const Staah = `https://ota.hostynnist.com/api`
// const BASE_URL = `https://api.hostynnist.com/api`
// const BASE_URL = process.env.REACT_APP_BASE_URL
// const BASE_URL = URL.BASE_URL
//const BASE_URL = process.env.REACT_APP_MOCKUP_URL
// const token = localStorage.getItem('accessToken')
const jwtconfig = { ...jwtDefaultConfig }

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Access-Control-Allow-Origin': '*', //
        'Content-Type': 'application/json',

    }
})

axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // debugger
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.data.Message === "Invalid user or token") {
        // console.log(error)
        // location.replace("http://localhost:3000/login")
        window.location.href = "/login"
       
        
        localStorage.removeItem("userData")
    } else return Promise.reject(error);
});

export default axiosInstance