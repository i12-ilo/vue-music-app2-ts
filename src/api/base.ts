import axios from 'axios'
const Axios = axios.create({
  baseURL: 'http://10.101.1.227:3000'
})
export default Axios