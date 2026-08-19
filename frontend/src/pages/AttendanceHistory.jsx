import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
} from 'lucide-react';

export default function AttendanceHistory() {

    const navigate = useNavigate();

    return (
        <div className='space-y-8'>
            {/*Header*/}
            <div>
                <button
                onClick={() => navigate('/attendance')}
                className="mb-4 text-gray-900 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={28} />
                </button>

                <h1 className="text-3xl font-bold text-black">
                    Attendance History
                </h1>
            </div>

           
        </div>
    )
}