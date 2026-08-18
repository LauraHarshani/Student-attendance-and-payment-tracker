import { History } from "lucide-react"

export default function Attendance() {
  return(
    <div className="space-y-6">

      {/*header title*/}
      <div className="flex items-center justify-between">
        <div >
          <h1 className="text-3xl font-bold text-black">Attendance</h1>
          <p className="text-gray-600 text-sm">Manage today's student attendance</p>
        </div>
        <div>
          <button type="button" className="flex items-center gap-2 border rounded-md border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 cursor-pointer transition hover:bg-blue-50"
          >
            <History size={18} />
            History
          </button>
        </div>
      </div>
    </div>
  )
}