/* eslint-disable prefer-promise-reject-errors */
import { Buffer } from 'buffer'

async function transformFileToBuffer(file: any) {
  return new Promise((resolve, reject) => {
    if (!file) reject(false)
    const reader = new FileReader()

    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const buffer = Buffer.from(arrayBuffer)

      resolve(buffer)
    }

    reader.readAsArrayBuffer(file)
  })
}

export { transformFileToBuffer }
