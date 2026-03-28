import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { initDatabase } from '../src/database/database';
import db from '../src/database/database';
import CadastroScreen from '../src/screens/CadastroScreen';
import HomeScreen from '../src/screens/HomeScreen';
import CadastroTarefaScreen from '../src/screens/CadastroTarefaScreen';
import MudarPerfilScreen from '../src/screens/MudarPerfilScreen';
import EditarPerfilScreen from '../src/screens/EditarPerfilScreen';
import HistoricoScreen from '../src/screens/HistoricoScreen';
import { agendarNotificacoesPerfil, solicitarPermissao, configurarCanal } from '../src/services/notificacoes';

export default function Index() {
  const [carregando, setCarregando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [tela, setTela] = useState('home');
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [idPerfilEditando, setIdPerfilEditando] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    initDatabase();
    solicitarPermissao();
    configurarCanal();

    const perfil = db.getFirstSync('SELECT id_usuario FROM perfil_usuario LIMIT 1');
    if (perfil) {
      setIdUsuario(perfil.id_usuario);
      agendarNotificacoesPerfil(perfil.id_usuario);
    }
    setCarregando(false);

    // Escuta ações nas notificações
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const actionId = response.actionIdentifier;
      const idMedicamento = response.notification.request.content.data?.idMedicamento;

      if (actionId === 'MARCAR_FEITO' && idMedicamento) {
        const hoje = new Date().toISOString().split('T')[0];
        const agora = new Date().toTimeString().slice(0, 5);
        const existe = db.getFirstSync(
          'SELECT id_registro FROM historico_uso WHERE id_medicamento = ? AND data_execucao = ?',
          [idMedicamento, hoje]
        );
        if (existe) {
          db.runSync(
            'UPDATE historico_uso SET status = ?, horario_confirmacao = ? WHERE id_registro = ?',
            ['feito', agora, existe.id_registro]
          );
        } else {
          db.runSync(
            'INSERT INTO historico_uso (id_medicamento, data_execucao, status, horario_confirmacao) VALUES (?, ?, ?, ?)',
            [idMedicamento, hoje, 'feito', agora]
          );
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function trocarPerfil(id) {
    setIdUsuario(id);
    setTela('home');
    await agendarNotificacoesPerfil(id);
  }

  if (carregando) return null;

  if (!idUsuario) {
    return <CadastroScreen primeroAcesso={true} onCadastro={(id) => { setIdUsuario(id); agendarNotificacoesPerfil(id); setTela('home'); }} />;
  }

  if (tela === 'novoPerfil') {
    return (
      <CadastroScreen
        primeroAcesso={false}
        onCadastro={() => setTela('mudarPerfil')}
        onVoltar={() => setTela('mudarPerfil')}
      />
    );
  }

  if (tela === 'mudarPerfil') {
    return (
      <MudarPerfilScreen
        idUsuarioAtivo={idUsuario}
        onSelecionar={(id) => {
          if (id === 'novo') { setTela('novoPerfil'); }
          else { trocarPerfil(id); }
        }}
        onVoltar={() => setTela('home')}
        onEditarPerfil={(id) => { setIdPerfilEditando(id); setTela('editarPerfil'); }}
      />
    );
  }

  if (tela === 'editarPerfil') {
    return (
      <EditarPerfilScreen
        idUsuario={idPerfilEditando}
        onSalvar={() => { setIdPerfilEditando(null); setTela('mudarPerfil'); }}
        onVoltar={() => { setIdPerfilEditando(null); setTela('mudarPerfil'); }}
      />
    );
  }

  if (tela === 'cadastroTarefa') {
    return (
      <CadastroTarefaScreen
        idUsuario={idUsuario}
        tarefaExistente={tarefaEditando}
        onSalvar={async () => {
          setTarefaEditando(null);
          setTela('home');
          await agendarNotificacoesPerfil(idUsuario);
        }}
        onVoltar={() => { setTarefaEditando(null); setTela('home'); }}
      />
    );
  }

  if (tela === 'historico') {
    return (
      <HistoricoScreen
        idUsuario={idUsuario}
        onVoltar={() => setTela('home')}
        onEditTarefa={(tarefa) => { setTarefaEditando(tarefa); setTela('cadastroTarefa'); }}
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
      onHistorico={() => setTela('historico')}
      onEditarPerfil={() => { setIdPerfilEditando(idUsuario); setTela('editarPerfil'); }}
    />
  );
}
