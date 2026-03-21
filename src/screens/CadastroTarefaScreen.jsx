import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert
} from 'react-native';
import db from '../database/database';
import { ICONES_LISTA } from '../assets/icons/icones';

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function CadastroTarefaScreen({ idUsuario, tarefaExistente, onSalvar, onVoltar }) {
  const editando = !!tarefaExistente;

  const [titulo, setTitulo] = useState(tarefaExistente?.titulo || '');
  const [subtitulo, setSubtitulo] = useState(tarefaExistente?.subtitulo_instrucao || '');
  const [horario, setHorario] = useState(tarefaExistente?.horario_programado || '08:00');
  const [icone, setIcone] = useState(tarefaExistente?.icone_tipo || 'remedio');
  const [descricao, setDescricao] = useState(tarefaExistente?.descricao || '');
  const [diasSelecionados, setDiasSelecionados] = useState(
    tarefaExistente?.frequencia_dias
      ? tarefaExistente.frequencia_dias.split('').map(Number)
      : [1,1,1,1,1,1,1]
  );

  const formularioValido = titulo.trim().length > 0 && horario.trim().length > 0;

  function toggleDia(index) {
    const novos = [...diasSelecionados];
    novos[index] = novos[index] === 1 ? 0 : 1;
    setDiasSelecionados(novos);
  }

  function salvar() {
    if (diasSelecionados.every(d => d === 0)) {
      Alert.alert('Atenção', 'Selecione pelo menos um dia da semana.');
      return;
    }
    if (editando) {
      db.runSync(
        `UPDATE medicamento SET titulo=?, subtitulo_instrucao=?, horario_programado=?, icone_tipo=?, frequencia_dias=?
         WHERE id_medicamento=?`,
        [titulo.trim(), subtitulo.trim(), horario.trim(), icone, diasSelecionados.join(''), tarefaExistente.id_medicamento]
      );
    } else {
      db.runSync(
        `INSERT INTO medicamento (id_usuario, titulo, subtitulo_instrucao, horario_programado, icone_tipo, frequencia_dias, ativo)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [idUsuario, titulo.trim(), subtitulo.trim(), horario.trim(), icone, diasSelecionados.join('')]
      );
    }
    onSalvar();
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={onVoltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>{editando ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>

      <Text style={styles.secao}>Ícone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconesList}>
        {ICONES_LISTA.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[styles.iconeOpcao, icone === item.key && styles.iconeSelecionado]}
            onPress={() => setIcone(item.key)}
          >
            <Text style={styles.iconeEmoji}>{item.emoji}</Text>
            <Text style={styles.iconeLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.secao}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Remédio da manhã"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.secao}>Instrução rápida</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Antes do café"
        value={subtitulo}
        onChangeText={setSubtitulo}
      />

      <Text style={styles.secao}>Horário</Text>
      <TextInput
        style={styles.input}
        placeholder="08:00"
        value={horario}
        onChangeText={setHorario}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.secao}>Dias da semana</Text>
      <View style={styles.diasContainer}>
        {DIAS.map((dia, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dia, diasSelecionados[index] === 1 && styles.diaSelecionado]}
            onPress={() => toggleDia(index)}
          >
            <Text style={[styles.diaTexto, diasSelecionados[index] === 1 && styles.diaTextoSelecionado]}>
              {dia}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.secao}>Descrição detalhada</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Detalhes adicionais sobre esta tarefa..."
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.botao, !formularioValido && styles.botaoDesabilitado]}
        onPress={salvar}
        disabled={!formularioValido}
      >
        <Text style={styles.botaoTexto}>{editando ? 'Salvar alterações' : 'Salvar'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  voltar: { marginTop: 40, marginBottom: 8 },
  voltarTexto: { fontSize: 16, color: '#1a3cff', fontWeight: '600' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  secao: { fontSize: 14, fontWeight: '700', color: '#555', marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 12, fontSize: 16 },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  iconesList: { marginBottom: 4 },
  iconeOpcao: { alignItems: 'center', padding: 12, marginRight: 8, borderRadius: 12, borderWidth: 2, borderColor: '#e0e0e0', minWidth: 80 },
  iconeSelecionado: { borderColor: '#1a3cff', backgroundColor: '#eef0ff' },
  iconeEmoji: { fontSize: 28 },
  iconeLabel: { fontSize: 11, color: '#555', marginTop: 4, textAlign: 'center' },
  diasContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  dia: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  diaSelecionado: { backgroundColor: '#1a3cff', borderColor: '#1a3cff' },
  diaTexto: { fontWeight: 'bold', color: '#555' },
  diaTextoSelecionado: { color: '#fff' },
  botao: { backgroundColor: '#1a3cff', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
  botaoDesabilitado: { backgroundColor: '#aaa' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
