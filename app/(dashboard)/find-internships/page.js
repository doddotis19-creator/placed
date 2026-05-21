import { MOCK_INTERNSHIPS } from '@/lib/mock-data'
import InternshipsClient from './InternshipsClient'

export const metadata = { title: 'Find Internships — Placed' }

export default async function FindInternshipsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#F5F5F5', letterSpacing: '-0.02em' }}>
          Find Internships
        </h1>
        <p className="text-sm" style={{ color: '#525252' }}>
          {MOCK_INTERNSHIPS.length} curated listings across finance, technology, consulting, law and more.
        </p>
      </div>
      <InternshipsClient
        internships={MOCK_INTERNSHIPS}
        userSectors={[]}
        userLocations={[]}
      />
    </div>
  )
}
