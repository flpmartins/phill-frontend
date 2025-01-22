/* eslint-disable no-useless-escape */
import axios from 'axios'

export const viaCepApi = axios.create({
  baseURL: `https://viacep.com.br/ws`,
})
