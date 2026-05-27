import { useEffect, useState } from 'react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_DRIVE_API_KEY
const cache = new Map()

export default function useDriveFolders(parentId) {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!parentId || !API_KEY) { setLoading(false); return }

    if (cache.has(parentId)) {
      setFolders(cache.get(parentId))
      setLoading(false)
      return
    }

    setLoading(true)
    const q      = encodeURIComponent(`'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`)
    const fields = encodeURIComponent('files(id,name)')
    const url    = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${API_KEY}&fields=${fields}&pageSize=100&orderBy=name`

    axios.get(url)
      .then(res => {
        const arr = res.data?.files ?? []
        cache.set(parentId, arr)
        setFolders(arr)
      })
      .catch(() => setFolders([]))
      .finally(() => setLoading(false))
  }, [parentId])

  return { folders, loading }
}
