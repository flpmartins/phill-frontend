import { AxiosRequestConfig } from 'axios'
import { environment } from '../../../../environment'

export const tokenInterceptor = (request: AxiosRequestConfig) => {
  const payload = localStorage.getItem(`${environment.APP_NAME}`)
  const token = payload ? JSON.parse(payload).token : null

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`
  }

  return request
}
