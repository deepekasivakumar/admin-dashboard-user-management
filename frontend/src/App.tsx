import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';

// Mock dashboard page for now
function DashboardMock() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
            <svg className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <select className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 bg-white">
            <option>Most Recent</option>
          </select>
          <button className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 bg-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            Filters
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Create New Client
          </button>
        </div>
      </div>
      
      {/* Table Mockup to match image */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8f9fc] text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3 flex items-center gap-1">Company Name <span className="text-[10px]">↕</span></th>
              <th className="px-4 py-3">Parent Site <span className="text-[10px]">↕</span></th>
              <th className="px-4 py-3">Contact Person <span className="text-[10px]">↕</span></th>
              <th className="px-4 py-3">Email <span className="text-[10px]">↕</span></th>
              <th className="px-4 py-3">Phone <span className="text-[10px]">↕</span></th>
              <th className="px-4 py-3">GST Registration No.</th>
              <th className="px-4 py-3">Status <span className="text-[10px]">↕</span></th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample row */}
            <tr className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-4 py-3 text-gray-500">1</td>
              <td className="px-4 py-3 text-gray-700">Espinoza and Williamson Plc</td>
              <td className="px-4 py-3 text-gray-400">-</td>
              <td className="px-4 py-3 text-gray-600">Fiona Gay</td>
              <td className="px-4 py-3 text-gray-500">kenywo@mailinator.com</td>
              <td className="px-4 py-3 text-gray-600">9876545699</td>
              <td className="px-4 py-3 text-gray-500">27ABCDE1234F1Z5</td>
              <td className="px-4 py-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-orange-200 text-orange-600 bg-orange-50/50">Pending</span>
              </td>
              <td className="px-4 py-3">
                <div className="w-8 h-4 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </td>
            </tr>
            {/* Sample row 2 active */}
            <tr className="border-b border-gray-50 bg-[#eff4ff]">
              <td className="px-4 py-3 text-gray-500">2</td>
              <td className="px-4 py-3 text-gray-700">Ferguson and Chaney Trad...</td>
              <td className="px-4 py-3 text-gray-400">-</td>
              <td className="px-4 py-3 text-gray-600">Mary Woods</td>
              <td className="px-4 py-3 text-gray-500">bobosox@mailinator.com</td>
              <td className="px-4 py-3 text-gray-600">7654356788</td>
              <td className="px-4 py-3 text-gray-500 relative">
                27ABCDE1234F1Z5
                <div className="absolute top-10 left-0 bg-white border border-gray-200 shadow-md p-1 rounded text-xs z-10">27ABCDE1234F1Z5</div>
              </td>
              <td className="px-4 py-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-red-200 text-red-600 bg-red-50/50">Rejected</span>
              </td>
              <td className="px-4 py-3">
                <div className="w-8 h-4 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </td>
            </tr>
            {/* Sample row 3 */}
            <tr className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="px-4 py-3 text-gray-500">3</td>
              <td className="px-4 py-3 text-gray-700">Mcclain and Colon Traders</td>
              <td className="px-4 py-3 text-gray-400">-</td>
              <td className="px-4 py-3 text-gray-600">Harper Andrews</td>
              <td className="px-4 py-3 text-gray-500">rukozipat@mailinator.com</td>
              <td className="px-4 py-3 text-gray-600">7367467267</td>
              <td className="px-4 py-3 text-gray-500">-</td>
              <td className="px-4 py-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-green-200 text-green-600 bg-green-50/50">Approved</span>
              </td>
              <td className="px-4 py-3">
                <div className="w-8 h-4 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
          <div className="text-sm text-gray-500">
            Showing 1 to 10 of 11 results
          </div>
          <div className="flex items-center gap-1 text-sm">
            <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50">&laquo;</button>
            <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50">&lsaquo;</button>
            <span className="px-2 text-gray-600">Page 1 of 2</span>
            <button className="px-2.5 py-1 border border-gray-200 rounded text-blue-600 border-blue-200 hover:bg-blue-50">&rsaquo;</button>
            <button className="px-2.5 py-1 border border-gray-200 rounded text-blue-600 border-blue-200 hover:bg-blue-50">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardMock />} />
          {/* Add more routes here later */}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
