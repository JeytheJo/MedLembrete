import { useEffect, useState } from 'react';
import db, { initDatabase } from '../src/database/database';
import CadastroScreen from '../src/screens/CadastroScreen';
import CadastroTarefaScreen from '../src/screens/CadastroTarefaScreen';
import HomeScreen from '../src/screens/HomeScreen';

export default function Index() {
  const [carregando, setCarregando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [tela, setTela] = useState('home');
  const [tarefaEditando, setTarefaEditando] = useState(null);

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
        tarefaExistente={tarefaEditando}
        onSalvar={() => { setTarefaEditando(null); setTela('home'); }}
        onVoltar={() => { setTarefaEditando(null); setTela('home'); }}
      />
    );
  }

  return (
    <HomeScreen
      key={tela}
      idUsuario={idUsuario}
      onAddTarefa={() => { setTarefaEditando(null); setTela('cadastroTarefa'); }}
      onEditTarefa={(tarefa) => { setTarefaEditando(tarefa); setTela('cadastroTarefa'); }}
      onMudarPerfil={() => setTela('mudarPerfil')}
    />
  );
}
