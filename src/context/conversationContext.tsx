import React, { createContext, useContext, useState } from "react";

type ConversationContextType = {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
};

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  return (
    <ConversationContext.Provider value={{ activeConversationId, setActiveConversationId }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error("useConversation must be used inside ConversationProvider");
  return ctx;
}
