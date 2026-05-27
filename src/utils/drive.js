export const driveImg   = (id) => `/api/img?id=${id}&export=view`
export const driveThumb = (id, size = 320) => `/api/thumb?id=${id}&sz=w${size}`
