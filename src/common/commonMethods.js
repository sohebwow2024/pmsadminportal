import axios from "../API/axios"
import CryptoJS from 'crypto-js'

let obj = {};

export const userDataApi = async (body) => {
  console.log("getting body: ", JSON.stringify(body))
  const res = await axios.post('/getdata/userdata/userdetails', body)
  return res

}
export const openLinkInNewTab = (url) => {
  const newTab = window.open(url, '_blank', 'noopener,noreferrer');
  if (newTab) newTab.opener = null;
}
export const usersRoleDataApi = async (body) => {
  console.log("getting body: ", JSON.stringify(body))
  const res = await axios.post('/getdata/userdata/userrole', body)
  return res

}
export const cipherPasswordFunc = (password) => {
  const hash = CryptoJS.MD5(password)
  const cipherPassword = CryptoJS.enc.Base64.stringify(hash);
  console.log("cipherPassword", cipherPassword);
  return cipherPassword;
}

export const arrayToObject = (array) => {
  array.forEach(element => {
    if (Array.isArray(element)) {
      arrayToObject(element)
    } else {
      obj = { ...obj, ...element }
    }
  });
  return obj
}