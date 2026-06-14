import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { type Patient } from '../types/types'
import PatientTable from './PatientTable'
import PatientDetailsPane from './PatientDetailsPane'

const selectSx = {
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1A7A8A',
    borderWidth: '1.5px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e5e7eb',
  },
  '.MuiSelect-select': {
    paddingLeft: '12px',
    paddingRight: '24px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#1B2D5E',
  }
};

interface PatientsTabProps {
  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void
  loading: boolean
  error: string | null
  filteredPatients: Patient[]
  handlePatientClick: (patient: Patient) => void
  patientPictures: Record<string, string>
  handlePictureChange: (patientId: string, base64: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  priorityFilter: string
  setPriorityFilter: (priority: string) => void
  genderFilter: string
  setGenderFilter: (gender: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export default function PatientsTab({
  selectedPatient,
  setSelectedPatient,
  loading,
  error,
  filteredPatients,
  handlePatientClick,
  patientPictures,
  handlePictureChange,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  genderFilter,
  setGenderFilter,
  sortBy,
  setSortBy
}: PatientsTabProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
      {/* Left Column: Patient List Directory */}
      <div className={`${selectedPatient ? 'xl:col-span-7' : 'xl:col-span-12'} bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6 transition-all duration-300 w-full`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Patient Directory</h3>
            <p className="text-[13px] text-gray-400 font-medium">Viewing all patient records in the database</p>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100/80">
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as string)}
              size="small"
              className="!w-full !h-9 !bg-white !rounded-lg"
              sx={selectSx}
            >
              <MenuItem value="All" sx={{ fontSize: '12px', fontHighlight: 600, color: '#1B2D5E' }}>All Statuses</MenuItem>
              <MenuItem value="Stable" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Stable</MenuItem>
              <MenuItem value="Critical" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Critical</MenuItem>
              <MenuItem value="Recovering" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Recovering</MenuItem>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Priority</label>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as string)}
              size="small"
              className="!w-full !h-9 !bg-white !rounded-lg"
              sx={selectSx}
            >
              <MenuItem value="All" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>All Patients</MenuItem>
              <MenuItem value="Priority" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Priority Only</MenuItem>
            </Select>
          </div>

          {/* Gender Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Gender</label>
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as string)}
              size="small"
              className="!w-full !h-9 !bg-white !rounded-lg"
              sx={selectSx}
            >
              <MenuItem value="All" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>All Genders</MenuItem>
              <MenuItem value="Male" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Male</MenuItem>
              <MenuItem value="Female" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Female</MenuItem>
            </Select>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Sort By</label>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as string)}
              size="small"
              className="!w-full !h-9 !bg-white !rounded-lg"
              sx={selectSx}
            >
              <MenuItem value="default" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Default (ID)</MenuItem>
              <MenuItem value="name-asc" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Name (A-Z)</MenuItem>
              <MenuItem value="name-desc" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Name (Z-A)</MenuItem>
              <MenuItem value="age-asc" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Age (Youngest first)</MenuItem>
              <MenuItem value="age-desc" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Age (Oldest first)</MenuItem>
              <MenuItem value="heart-desc" sx={{ fontSize: '12px', fontWeight: 600, color: '#1B2D5E' }}>Heart Rate (High to Low)</MenuItem>
            </Select>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-y-auto overflow-x-auto max-h-[650px] pr-1.5 custom-scrollbar">
          <PatientTable
            loading={loading}
            error={error}
            filteredPatients={filteredPatients}
            selectedPatientId={selectedPatient?.id}
            handlePatientClick={handlePatientClick}
            patientPictures={patientPictures}
          />
        </div>
      </div>

      {/* Right Column: Selected Patient Details (Full info, Custom Pic, Vitals Chart) */}
      {selectedPatient && (
        <div className="xl:col-span-5 w-full sticky top-0 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide rounded-2xl">
          <PatientDetailsPane
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
            patientPictures={patientPictures}
            onAvatarChange={handlePictureChange}
          />
        </div>
      )}
    </div>
  )
}
