import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-serif text-2xl font-bold text-brand-red">Hotel Cúcuta</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
