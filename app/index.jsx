import { useEffect, useState } from 'react';
import { initDatabase } from '../src/database/database';
import db from '../src/database/database';
import CadastroScreen from '../src/screens/CadastroScreen';
import HomeScreen from '../src/screens/HomeScreen';
import CadastroTarefaScreen from '../src/screens/CadastroTarefaScreen';

export default function Index() {
  const [carregando, setCarregando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [tela, setTela] = useState('home');

  useEffect(() => {
    initDatabase();
    const perfil = db.getFirstSync('SELECT id_usuario FROM perfil_usuario LIMIT 1');
    if (perfil) setIdUsuario(perfil.id_usuario);
    setCarregando(false);
  }, []);

  if (carregando) return null;

  if (!idUsuario) {
    return <CadastroScreen onCadastro={(id) => setIdUsuario(id)} />;
  }

  if (tela === 'cadastroTarefa') {
    return (
      <CadastroTarefaScreen
        idUsuario={idUsuario}
        onSalvar={() => setTela('home')}
        onVoltar={() => setTela('home')}
      />
    );
  }

  return <HomeScreen idUsuario={idUsuario} onAddTarefa={() => setTela('cadastroTarefa')} />;
}
