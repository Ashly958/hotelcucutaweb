import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertaUI {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  mensaje: string;
  duracionMs?: number;
}

interface UiState {
  sidebarAbierto: boolean;
  alertas: AlertaUI[];
}

const initialState: UiState = {
  sidebarAbierto: true,
  alertas: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarAbierto = !state.sidebarAbierto;
    },
    setSidebarAbierto: (state, action: PayloadAction<boolean>) => {
      state.sidebarAbierto = action.payload;
    },
    agregarAlerta: (state, action: PayloadAction<AlertaUI>) => {
      state.alertas.push(action.payload);
    },
    removerAlerta: (state, action: PayloadAction<string>) => {
      state.alertas = state.alertas.filter((alerta) => alerta.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarAbierto, agregarAlerta, removerAlerta } = uiSlice.actions;
export default uiSlice.reducer;
