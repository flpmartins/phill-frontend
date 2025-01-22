import { api } from '../services/api'

export async function getObject(key: string) {
  if (key) {
    await api
      .get(`/upload/object?key=${key}`)
      .then((res) => {
        const link = document.createElement('a')
        const url = res.data.signedUrl

        link.href = url
        link.target = '_blank'

        document.body.appendChild(link)

        link.click()
        document.body.removeChild(link)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
