import { useEffect, useState } from 'react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_DRIVE_API_KEY
const cache = new Map()

export default function useDrive(folderId) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!folderId || !API_KEY) {
      setLoading(false)
      return
    }

    if (cache.has(folderId)) {
      setFiles(cache.get(folderId))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const q      = encodeURIComponent(`'${folderId}' in parents and trashed=false`)
    const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink,webViewLink,webContentLink)')
    const url    = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${API_KEY}&fields=${fields}&pageSize=1000`

    axios.get(url)
      .then(res => {
        const arr = res.data?.files ?? []
        arr.sort((a, b) => {
          const aVid = a.mimeType?.startsWith('video')
          const bVid = b.mimeType?.startsWith('video')
          if (aVid && !bVid) return -1
          if (!aVid && bVid) return 1
          return (a.name ?? '').localeCompare(b.name ?? '')
        })
        cache.set(folderId, arr)
        setFiles(arr)
      })
      .catch(err => {
        console.error('Drive fetch error', err)
        setError(err)
        setFiles([])
      })
      .finally(() => setLoading(false))
  }, [folderId])

  return { files, loading, error }
}
