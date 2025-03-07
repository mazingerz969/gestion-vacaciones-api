import React, { useState } from 'react';
import { Calendar, Clock, User, Users, CheckCircle, XCircle, BarChart2 } from 'lucide-react';

// Datos de ejemplo
const empleadoEjemplo = {
  nombre: "Ana García",
  departamento: "Marketing",
  diasTotales: 22,
  diasUsados: 5,
  diasPendientes: 17,
  solicitudesPendientes: 1
};

const solicitudesEjemplo = [
  { id: 1, empleado: "Ana García", fechaInicio: "2025-04-15", fechaFin: "2025-04-22", estado: "pendiente", tipo: "vacaciones" },
  { id: 2, empleado: "Juan Pérez", fechaInicio: "2025-03-20", fechaFin: "2025-03-25", estado: "aprobada", tipo: "vacaciones" },
  { id: 3, empleado: "María López", fechaInicio: "2025-05-10", fechaFin: "2025-05-12", estado: "rechazada", tipo: "enfermedad" }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rol, setRol] = useState('empleado'); // empleado, manager, rrhh

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">VacationManager</h1>
          <div className="flex items-center gap-4">
            <select 
              className="bg-blue-700 text-white p-2 rounded" 
              value={rol} 
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="empleado">Empleado</option>
              <option value="manager">Manager</option>
              <option value="rrhh">RRHH</option>
            </select>
            <div className="flex items-center gap-2">
              <User size={20} />
              <span>{empleadoEjemplo.nombre}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button 
                  className={`flex items-center gap-2 w-full p-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <BarChart2 size={20} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  className={`flex items-center gap-2 w-full p-2 rounded ${activeTab === 'solicitar' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('solicitar')}
                >
                  <Calendar size={20} />
                  <span>Solicitar Vacaciones</span>
                </button>
              </li>
              <li>
                <button 
                  className={`flex items-center gap-2 w-full p-2 rounded ${activeTab === 'calendario' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('calendario')}
                >
                  <Calendar size={20} />
                  <span>Calendario</span>
                </button>
              </li>
              {(rol === 'manager' || rol === 'rrhh') && (
                <li>
                  <button 
                    className={`flex items-center gap-2 w-full p-2 rounded ${activeTab === 'aprobar' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('aprobar')}
                  >
                    <CheckCircle size={20} />
                    <span>Aprobar Solicitudes</span>
                  </button>
                </li>
              )}
              {rol === 'rrhh' && (
                <li>
                  <button 
                    className={`flex items-center gap-2 w-full p-2 rounded ${activeTab === 'gestion' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('gestion')}
                  >
                    <Users size={20} />
                    <span>Gestión de Días</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard de Vacaciones</h2>

              {/* Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">Días Disponibles</h3>
                    <Calendar className="text-blue-500" size={24} />
                  </div>
                  <p className="text-3xl font-bold mt-2">{empleadoEjemplo.diasPendientes}</p>
                  <p className="text-sm text-gray-500">de {empleadoEjemplo.diasTotales} días anuales</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(empleadoEjemplo.diasUsados / empleadoEjemplo.diasTotales) * 100}%` }} 
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">Solicitudes Pendientes</h3>
                    <Clock className="text-orange-500" size={24} />
                  </div>
                  <p className="text-3xl font-bold mt-2">{empleadoEjemplo.solicitudesPendientes}</p>
                  <button className="mt-4 text-sm text-blue-600 hover:underline">
                    Ver detalle
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">Próximas Vacaciones</h3>
                    <Calendar className="text-green-500" size={24} />
                  </div>
                  <p className="mt-2">15 Abril - 22 Abril</p>
                  <p className="text-sm text-gray-500">7 días (pendiente de aprobación)</p>
                </div>
              </div>

              {/* Recent Requests Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium text-gray-800">Solicitudes Recientes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {rol !== 'empleado' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {solicitudesEjemplo.map((solicitud) => (
                        <tr key={solicitud.id}>
                          {rol !== 'empleado' && <td className="px-6 py-4 whitespace-nowrap">{solicitud.empleado}</td>}
                          <td className="px-6 py-4 whitespace-nowrap">{solicitud.fechaInicio}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{solicitud.fechaFin}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{solicitud.tipo}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${solicitud.estado === 'aprobada' ? 'bg-green-100 text-green-800' : 
                                solicitud.estado === 'rechazada' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {solicitud.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {solicitud.estado === 'pendiente' ? (
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">Editar</button>
                                <button className="text-red-600 hover:text-red-900">Cancelar</button>
                              </div>
                            ) : (
                              <button className="text-blue-600 hover:text-blue-900">Ver detalle</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solicitar' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Solicitar Vacaciones</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Ausencia</label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                      <option>Vacaciones</option>
                      <option>Enfermedad</option>
                      <option>Permiso sin Sueldo</option>
                      <option>Otros</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                      <input type="date" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                      <input type="date" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comentarios</label>
                    <textarea className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" rows="3"></textarea>
                  </div>
                  
                  <div className="text-right">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Enviar Solicitud
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'calendario' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Calendario de Ausencias</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center mb-4">
                  <div className="flex justify-between items-center">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-medium">Marzo 2025</h3>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                    <div key={day} className="text-center font-semibold p-2">
                      {day}
                    </div>
                  ))}
                  {[...Array(31)].map((_, i) => {
                    let day = i + 1;
                    let isVacation = day >= 20 && day <= 25;
                    let isPending = day >= 15 && day <= 22;
                    let isWeekend = day % 7 === 6 || day % 7 === 0;
                    
                    return (
                      <div 
                        key={i} 
                        className={`text-center p-2 rounded-lg ${
                          isVacation ? 'bg-green-100 text-green-800' : 
                          isPending ? 'bg-yellow-100 text-yellow-800' : 
                          isWeekend ? 'bg-gray-100 text-gray-400' : ''
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-100"></div>
                    <span className="text-sm">Aprobadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-100"></div>
                    <span className="text-sm">Pendientes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                    <span className="text-sm">Fin de semana</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aprobar' && (rol === 'manager' || rol === 'rrhh') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Aprobar Solicitudes</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-800 font-semibold">AG</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Ana García</div>
                              <div className="text-sm text-gray-500">Marketing</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">15/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap">22/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap">7</td>
                        <td className="px-6 py-4 whitespace-nowrap">Vacaciones</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="p-2 bg-green-100 rounded-full text-green-800 hover:bg-green-200">
                              <CheckCircle size={16} />
                            </button>
                            <button className="p-2 bg-red-100 rounded-full text-red-800 hover:bg-red-200">
                              <XCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gestion' && rol === 'rrhh' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Días</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">Empleados</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Añadir Días Extra
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Totales</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Usados</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Pendientes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-800 font-semibold">AG</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Ana García</div>
                              <div className="text-sm text-gray-500">ana.garcia@empresa.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Marketing</td>
                        <td className="px-6 py-4 whitespace-nowrap">22</td>
                        <td className="px-6 py-4 whitespace-nowrap">5</td>
                        <td className="px-6 py-4 whitespace-nowrap">17</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900">Editar</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-800 font-semibold">JP</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Juan Pérez</div>
                              <div className="text-sm text-gray-500">juan.perez@empresa.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Desarrollo</td>
                        <td className="px-6 py-4 whitespace-nowrap">22</td>
                        <td className="px-6 py-4 whitespace-nowrap">10</td>
                        <td className="px-6 py-4 whitespace-nowrap">12</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900">Editar</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
