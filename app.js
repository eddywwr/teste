import React, { useState, useEffect } from 'react';
import { MapPin, Bell, Phone, ShieldAlert, Clock, User, Navigation, Menu, Play, Pause, RotateCcw } from 'lucide-react';



const STUDENTS = [
  { id: 1, name: 'João Silva', status: 'Em trânsito', school: 'Escola Primária Central', transport: 'Autocarro 42' },
];

const ROUTE_PATH = [
  { x: 20, y: 80, label: 'Casa' },
  { x: 20, y: 60 },
  { x: 40, y: 60 },
  { x: 40, y: 40 },
  { x: 60, y: 40 },
  { x: 60, y: 20 },
  { x: 80, y: 20, label: 'Escola' }
];

const HISTORY_DATA = [
  { id: 1, date: '18 Nov', time: '07:30 - 08:15', route: 'Casa -> Escola', status: 'Concluído' },
  { id: 2, date: '17 Nov', time: '13:00 - 13:45', route: 'Escola -> Casa', status: 'Concluído' },
  { id: 3, date: '17 Nov', time: '07:30 - 08:20', route: 'Casa -> Escola', status: 'Atraso (Trânsito)' },
];



const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "w-full py-3 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-200",
    danger: "bg-red-600 text-white shadow-lg shadow-red-200 animate-pulse",
    outline: "border-2 border-blue-600 text-blue-600",
    ghost: "bg-gray-100 text-gray-600",
    sm: "bg-gray-800 text-white text-xs py-2 px-4"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};



const LoginScreen = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-b from-blue-50 to-white">
    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
      <MapPin size={48} className="text-white" />
    </div>
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Rastreio Escolar</h1>
    <p className="text-gray-500 mb-10 text-center">Segurança para os teus filhos no trajeto escolar.</p>
    
    <div className="w-full space-y-4">
      <input 
        type="email" 
        placeholder="Email do Responsável" 
        className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition-colors"
      />
      <input 
        type="password" 
        placeholder="Palavra-passe" 
        className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition-colors"
      />
      <Button onClick={onLogin}>Entrar</Button>
      <p className="text-center text-sm text-gray-400 mt-4">Versão Demo v1.0</p>
    </div>
  </div>
);

const MapScreen = ({ activeStudent }) => {
  const [position, setPosition] = useState(ROUTE_PATH[0]);
  const [pathIndex, setPathIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);


  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (!isSimulating) return;
      setProgress((prev) => {
        const newProgress = prev + 0.005;
        if (newProgress >= 1) {
          if (pathIndex < ROUTE_PATH.length - 1) {
            setPathIndex(prevIndex => prevIndex + 1);
            return 0; 
          } else {
            setIsSimulating(false); 
            return 1;
          }
        }
        return newProgress;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    if (isSimulating) animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isSimulating, pathIndex]);


  useEffect(() => {
    if (pathIndex >= ROUTE_PATH.length - 1) return;
    const start = ROUTE_PATH[pathIndex];
    const end = ROUTE_PATH[pathIndex + 1];
    setPosition({
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress
    });
  }, [progress, pathIndex]);

  const toggleSimulation = () => setIsSimulating(!isSimulating);
  const resetSimulation = () => {
    setIsSimulating(false);
    setPathIndex(0);
    setProgress(0);
    setPosition(ROUTE_PATH[0]);
  };

  const triggerSimulationAlert = () => {
    setIsSimulating(false); 
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 5000);
  };

  return (
    <div className="relative w-full h-full bg-gray-200 overflow-hidden">
      
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px), radial-gradient(#9ca3af 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px'
      }}></div>
      
     
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <polyline 
          points={ROUTE_PATH.map(p => `${p.x}%,${p.y}%`).join(' ')} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="8" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

     
      {ROUTE_PATH.map((point, idx) => point.label && (
        <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
          <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600 uppercase">{point.label}</span>
        </div>
      ))}
      
      
      {alertVisible && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border-l-4 border-red-500 p-4 rounded shadow-lg z-50 animate-bounce">
          <div className="flex items-center">
            <ShieldAlert className="text-red-600 mr-3" />
            <div>
              <p className="font-bold text-red-700">Alerta de Desvio!</p>
              <p className="text-xs text-red-600">O veículo saiu da rota prevista.</p>
            </div>
          </div>
        </div>
      )}

      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
        <button onClick={toggleSimulation} className="bg-white p-2 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center">
          {isSimulating ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={resetSimulation} className="bg-white p-2 rounded-full shadow-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">
          <RotateCcw size={20} />
        </button>
        <button onClick={triggerSimulationAlert} className="bg-white p-2 rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-colors mt-2 flex items-center justify-center" title="Simular Desvio">
          <ShieldAlert size={20} />
        </button>
      </div>

      
      <div 
        className="absolute transition-all duration-75 ease-linear z-10 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
      >
        <div className="bg-blue-500/20 rounded-full p-2 animate-ping absolute"></div>
        <div className="w-12 h-12 bg-white rounded-full border-4 border-blue-600 shadow-xl flex items-center justify-center overflow-hidden relative z-20">
           <User size={24} className="text-blue-600" />
        </div>
        <div className="mt-1 bg-white px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap z-30">
          {activeStudent.name}
        </div>
      </div>

     
      <div className="absolute bottom-24 left-4 right-4 bg-white p-4 rounded-2xl shadow-xl z-30">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800">{activeStudent.transport}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Navigation size={14} /> {isSimulating ? 'Em movimento' : 'A aguardar...'}
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${isSimulating ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {isSimulating ? 'Em trânsito' : 'Parado'}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((pathIndex + progress) / (ROUTE_PATH.length - 1)) * 100}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Casa</span>
          <span>{(15 - (pathIndex * 2)).toFixed(0)} min</span>
          <span>Escola</span>
        </div>
      </div>
    </div>
  );
};

const HistoryScreen = () => (
  <div className="p-6 pb-24 h-full overflow-y-auto bg-gray-50">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Histórico de Trajetos</h2>
    <div className="space-y-4">
      {HISTORY_DATA.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <Clock size={16} />
              {item.date}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              item.status.includes('Atraso') ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
            }`}>
              {item.status}
            </span>
          </div>
          <div className="pl-6 border-l-2 border-gray-200 ml-2 space-y-1">
            <p className="text-sm text-gray-800 font-semibold">{item.route}</p>
            <p className="text-xs text-gray-500">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmergencyScreen = () => {
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(5);

  const handlePanic = () => {
    setCounting(true);
    let c = 5;
    const timer = setInterval(() => {
      c -= 1;
      setCount(c);
      if (c === 0) {
        clearInterval(timer);
        alert("ALERTA ENVIADO À ESCOLA E AUTORIDADES!");
        setCounting(false);
        setCount(5);
      }
    }, 1000);
  };

  const cancelPanic = () => {
    setCounting(false);
    setCount(5);
  };

  return (
    <div className="h-full bg-red-50 p-6 flex flex-col items-center justify-center text-center">
      <ShieldAlert size={64} className="text-red-600 mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-2">MODO EMERGÊNCIA</h2>
      <p className="text-gray-600 mb-10 max-w-xs">
        Usa este botão apenas em caso de perigo real. O alerta será enviado imediatamente.
      </p>

      {counting ? (
        <div className="flex flex-col items-center animate-pulse">
          <span className="text-6xl font-bold text-red-600 mb-4">{count}</span>
          <p className="text-red-800 font-medium mb-6">A enviar alerta...</p>
          <Button variant="outline" onClick={cancelPanic} className="bg-white border-red-200 !text-red-600">
            CANCELAR
          </Button>
        </div>
      ) : (
        <button 
          onClick={handlePanic}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl shadow-red-400 flex items-center justify-center active:scale-95 transition-transform border-8 border-red-100"
        >
          <div className="text-white font-bold text-xl flex flex-col items-center gap-1">
            <Bell size={32} />
            <span>SOS</span>
          </div>
        </button>
      )}
      
      <div className="mt-12 w-full">
        <h3 className="text-left font-bold text-gray-700 mb-3">Contactos Rápidos</h3>
        <div className="space-y-3">
          <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-3"><Phone size={18} className="text-green-600"/> Motorista Escolar</span>
          </button>
          <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-3"><Phone size={18} className="text-blue-600"/> Secretaria da Escola</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [activeStudent, setActiveStudent] = useState(STUDENTS[0]);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'map': return <MapScreen activeStudent={activeStudent} />;
      case 'history': return <HistoryScreen />;
      case 'emergency': return <EmergencyScreen />;
      default: return <MapScreen activeStudent={activeStudent} />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 font-sans p-4">
      
      <div className="w-full max-w-md h-[800px] bg-white relative shadow-2xl overflow-hidden flex flex-col sm:rounded-[3rem] sm:border-[8px] sm:border-gray-900">
        
        
        <div className="h-14 bg-white flex items-center justify-between px-6 pt-2 shadow-sm z-50">
          <Menu size={24} className="text-gray-600" />
          <span className="font-bold text-gray-800">Rastreio Escolar</span>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
             <User size={16} className="text-gray-600"/>
          </div>
        </div>

        
        <div className="flex-1 relative overflow-hidden">
          {renderContent()}
        </div>

      
        <div className="bg-white border-t border-gray-100 pb-6 pt-2 px-6 z-50">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Clock size={24} />
              <span className="text-[10px] font-medium">Histórico</span>
            </button>

            <button 
              onClick={() => setActiveTab('map')}
              className={`flex flex-col items-center gap-1 p-2 -mt-8 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-200 w-16 h-16 justify-center transition-transform ${activeTab === 'map' ? 'scale-110' : ''}`}
            >
              <MapPin size={28} />
            </button>

            <button 
              onClick={() => setActiveTab('emergency')}
              className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'emergency' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <ShieldAlert size={24} />
              <span className="text-[10px] font-medium">SOS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


