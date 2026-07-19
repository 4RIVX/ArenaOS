import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'fan' | 'volunteer' | 'staff' | 'organizer' | null;

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  activeFeature: string | null;
  setActiveFeature: (feature: string | null) => void;
  selectedStadium: string;
  setSelectedStadium: (stadium: string) => void;
  selectedGate: string;
  setSelectedGate: (gate: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<string>('Lusail Stadium');
  const [selectedGate, setSelectedGate] = useState<string>('Gate A');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeFeature,
        setActiveFeature,
        selectedStadium,
        setSelectedStadium,
        selectedGate,
        setSelectedGate,
        selectedLanguage,
        setSelectedLanguage,
        activeConversationId,
        setActiveConversationId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
