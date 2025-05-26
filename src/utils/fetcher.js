import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080/api/v1/students'

const fetcher = async (url) => {
    const { data } = await axios.get(url)
    return data
}
export default fetcher