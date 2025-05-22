import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, createContext } from "react";
import Index from './index';
import Tarefas from './tarefas';
import { createActor, to_do_backend, canisterId as backendCanisterId } from 'declarations/to_do_backend';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [principalText, setPrincipalText] = useState("");
  
  async function login() {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });

        const actor = createActor(backendCanisterId, { agent });
        const principal = await actor.get_principal_client();
        setPrincipalText(principal);
        setIsLoggedIn(true);
      },
      windowOpenerFeatures: 'left=100,top=100,toolbar=0,location=0,menubar=0,width=525,height=705',
    });
  }

  async function logout() {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setPrincipalText("");
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, principalText }}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tarefas/" element={<Tarefas />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
