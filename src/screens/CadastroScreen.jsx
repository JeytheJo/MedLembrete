import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import db from '../database/database';

export default function CadastroScreen({ onCadastro }) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const formularioValido = nome.trim().length > 0 && idade.trim().length > 0;

  function salvar() {
    db.runSync(
      'INSERT INTO perfil_usuario (name, idade) VALUES (?, ?)',
      [nome.trim(), idade.trim()]
    );
    const novo = db.getFirstSync('SELECT id_usuario FROM perfil_usuario ORDER BY id_usuario DESC LIMIT 1');
    onCadastro(novo.id_usuario);
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../src/assets/icons/logo.png')} style={styles.logo} />

      <Text style={styles.label}>Olá, Qual o seu nome?</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Qual a sua idade?</Text>
      <TextInput
        style={styles.input}
        placeholder="Sua idade"
        keyboardType="numeric"
        value={idade}
        onChangeText={setIdade}
      />

      <Text style={styles.subtitulo}>Ótimo! Vamos continuar?</Text>
      <TouchableOpacity
        style={[styles.botao, !formularioValido && styles.botaoDesabilitado]}
        onPress={salvar}
        disabled={!formularioValido}
      >
        <Text style={styles.botaoTexto}>Salvar e Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 32, resizeMode: 'contain' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#222' },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
  subtitulo: { textAlign: 'center', color: '#555', marginBottom: 12 },
  botao: { backgroundColor: '#1a3cff', borderRadius: 8, padding: 16, alignItems: 'center' },
  botaoDesabilitado: { backgroundColor: '#aaa' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
