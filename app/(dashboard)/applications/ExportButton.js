'use client'

import { Download } from 'lucide-react'

export default function ExportButton({ applications }) {
  async function handleExport() {
    // Dynamic import keeps xlsx out of the initial bundle
    const XLSX = (await import('xlsx')).default

    const rows = applications.map(app => ({
      Company: app.company ?? '',
      Role: app.role ?? '',
      Sector: app.sector ?? '',
      Location: app.location ?? '',
      Status: app.status ?? '',
      Deadline: app.deadline ?? '',
      'Date Applied': app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : '',
      Notes: app.notes ?? '',
      'Application Link': app.link ?? '',
    }))

    const ws = XLSX.utils.json_to_sheet(rows)

    // Column widths
    ws['!cols'] = [
      { wch: 24 }, // Company
      { wch: 30 }, // Role
      { wch: 16 }, // Sector
      { wch: 14 }, // Location
      { wch: 12 }, // Status
      { wch: 14 }, // Deadline
      { wch: 14 }, // Date Applied
      { wch: 36 }, // Notes
      { wch: 40 }, // Application Link
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Applications')

    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `placed-applications-${date}.xlsx`)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[8px] transition-all duration-150"
      style={{
        background: 'transparent',
        border: '1px solid #333333',
        color: '#A3A3A3',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#525252'
        e.currentTarget.style.color = '#F5F5F5'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#333333'
        e.currentTarget.style.color = '#A3A3A3'
      }}
    >
      <Download size={14} />
      Export to Excel
    </button>
  )
}
