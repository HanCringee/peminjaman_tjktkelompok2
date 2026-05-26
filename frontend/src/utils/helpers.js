import { format, parseISO } from 'date-fns'

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy')
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy HH:mm')
  } catch {
    return dateStr
  }
}

export function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    approved: 'bg-blue-500/10 text-blue-400',
    selesai: 'bg-green-500/10 text-green-400',
    ditolak: 'bg-red-500/10 text-red-400',
  }
  return colors[status] || 'bg-muted/20 text-muted'
}

export function getKondisiColor(kondisi) {
  const colors = {
    Baik: 'bg-green-500/10 text-green-400',
    Rusak: 'bg-red-500/10 text-red-400',
    'Perlu Perbaikan': 'bg-orange-500/10 text-orange-400',
  }
  return colors[kondisi] || 'bg-muted/20 text-muted'
}

export function getStokBadge(stok) {
  if (stok <= 0) return { label: 'Habis', class: 'bg-red-500/10 text-red-400' }
  if (stok <= 2) return { label: 'Hampir Habis', class: 'bg-orange-500/10 text-orange-400' }
  return { label: 'Tersedia', class: 'bg-green-500/10 text-green-400' }
}

export function formatStatus(status) {
  const labels = {
    pending: 'Pending',
    approved: 'Disetujui',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
  }
  return labels[status] || status
}

export function getAvatarUrl(user) {
  if (!user?.avatar_url) return null
  const url = user.avatar_url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/storage/')) return url
  return '/storage/' + url
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function getAvatarBg(name) {
  const colors = [
    'from-accent/80 to-secondary',
    'from-blue-500/80 to-blue-700',
    'from-purple-500/80 to-purple-700',
    'from-emerald-500/80 to-emerald-700',
    'from-rose-500/80 to-rose-700',
    'from-amber-500/80 to-amber-700',
    'from-cyan-500/80 to-cyan-700',
    'from-indigo-500/80 to-indigo-700',
  ]
  if (!name) return colors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
