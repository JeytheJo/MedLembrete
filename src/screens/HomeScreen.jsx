import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import db from '../database/database';

const PERIODOS = [
  { label: 'Pela Manhã', inicio: 5, fim: 11 },
  { label: 'Pela Tarde', inicio: 12, fim: 17 },
  { label: 'Pela Noite', inicio: 18, fim: 23 },
];

export default function HomeScreen({ idUsuario, onAddTarefa }) {
  const [tarefas, setTarefas] = useState([]);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    carregarDados();
  }, [idUsuario]);

  function carregarDados() {
    const p = db.getFirstSync('SELECT * FROM perfil_usuario WHERE id_usuario = ?', [idUsuario]);
    setPerfil(p);

    const hoje = new Date().toISOString().split('T')[0];
    const diaSemana = new Date().getDay();
    const t = db.getAllSync(
      `SELECT m.*, 
        (SELECT status FROM historico_uso h 
         WHERE h.id_medicamento = m.id_medicamento 
         AND h.data_execucao = ? LIMIT 1) as status_hoje
       FROM medicamento m 
       WHERE m.id_usuario = ? AND m.ativo = 1`,
      [hoje, idUsuario]
    ).filter(t => {
      const freq = t.frequencia_dias || '1111111';
      return freq[diaSemana] === '1';
    });
    setTarefas(t);
  }

  function marcarStatus(idMedicamento, novoStatus) {
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date().toTimeString().slice(0, 5);
    const existe = db.getFirstSync(
      'SELECT id_registro FROM historico_uso WHERE id_medicamento = ? AND data_execucao = ?',
      [idMedicamento, hoje]
    );
    if (existe) {
      db.runSync(
        'UPDATE historico_uso SET status = ?, horario_confirmacao = ? WHERE id_registro = ?',
        [novoStatus, agora, existe.id_registro]
      );
    } else {
      db.runSync(
        'INSERT INTO historico_uso (id_medicamento, data_execucao, status, horario_confirmacao) VALUES (?, ?, ?, ?)',
        [idMedicamento, hoje, novoStatus, agora]
      );
    }
    carregarDados();
  }

  function getTarefasPorPeriodo(inicio, fim) {
    return tarefas.filter(t => {
      const hora = parseInt(t.horario_programado?.split(':')[0] || '0');
      return hora >= inicio && hora <= fim;
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saudacao}>Olá, {perfil?.name} 👋</Text>
        <TouchableOpacity style={styles.botaoMudar}>
          <Text style={styles.botaoMudarTexto}>Mudar Perfil</Text>
        </TouchableOpacity>
      </View>

      {PERIODOS.map(periodo => {
        const lista = getTarefasPorPeriodo(periodo.inicio, periodo.fim);
        if (lista.length === 0) return null;
        return (
          <View key={periodo.label}>
            <Text style={styles.periodoTitulo}>{periodo.label}</Text>
            {lista.map(tarefa => (
              <View key={tarefa.id_medicamento} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitulo}>{tarefa.titulo}</Text>
                  <Text style={styles.cardSubtitulo}>{tarefa.subtitulo_instrucao}</Text>
                  <Text style={styles.cardHorario}>{tarefa.horario_programado}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.botaoStatus,
                    tarefa.status_hoje === 'feito' && styles.botaoFeito,
                  ]}
                  onPress={() => marcarStatus(
                    tarefa.id_medicamento,
                    tarefa.status_hoje === 'feito' ? 'pendente' : 'feito'
                  )}
                >
                  <Text style={styles.botaoStatusTexto}>
                    {tarefa.status_hoje === 'feito' ? 'Feito! ✓' : 'Não Realizado'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      })}

      {tarefas.length === 0 && (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Nenhuma tarefa para hoje!</Text>
          <Text style={styles.vazioSub}>Toque em + para adicionar</Text>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={onAddTarefa}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 48 },
  saudacao: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  botaoMudar: { backgroundColor: '#1a3cff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  botaoMudarTexto: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  periodoTitulo: { fontSize: 15, fontWeight: 'bold', color: '#555', paddingHorizontal: 20, paddingVertical: 8 },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', padding: 16 },
  cardInfo: { marginBottom: 10 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  cardSubtitulo: { fontSize: 13, color: '#666', marginTop: 2 },
  cardHorario: { fontSize: 14, fontWeight: '600', color: '#1a3cff', marginTop: 4 },
  botaoStatus: { backgroundColor: '#e0e0e0', borderRadius: 8, padding: 10, alignItems: 'center' },
  botaoFeito: { backgroundColor: '#1a3cff' },
  botaoStatusTexto: { color: '#fff', fontWeight: 'bold' },
  vazio: { alignItems: 'center', marginTop: 80 },
  vazioTexto: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  vazioSub: { fontSize: 14, color: '#aaa', marginTop: 8 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1a3cff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabTexto: { color: '#fff', fontSize: 32, lineHeight: 36 },
});
