import { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert } from 'react-native';
import db from '../database/database';
import BotaoAcessivel from '../components/BotaoAcessivel';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function CadastroScreen({ onCadastro }) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const formularioValido = nome.trim().length > 0 && idade.trim().length > 0;

  function salvar() {
    if (nome.trim().length < 2) {
      Alert.alert('Nome inválido', 'Por favor, informe um nome com pelo menos 2 letras.');
      return;
    }
    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum) || idadeNum < 1 || idadeNum > 120) {
      Alert.alert('Idade inválida', 'Por favor, informe uma idade válida entre 1 e 120 anos.');
      return;
    }
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

      <Text style={styles.label}>Olá, qual é o seu nome?</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        placeholderTextColor={COLORS.textMuted}
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <Text style={styles.label}>Qual a sua idade?</Text>
      <TextInput
        style={styles.input}
        placeholder="Sua idade"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="numeric"
        value={idade}
        onChangeText={setIdade}
        returnKeyType="done"
        maxLength={3}
      />

      <Text style={styles.subtitulo}>Ótimo! Vamos continuar?</Text>
      <BotaoAcessivel
        titulo="Salvar e Continuar"
        onPress={salvar}
        desabilitado={!formularioValido}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg, justifyContent: 'center' },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: SPACING.xl, resizeMode: 'contain' },
  label: { fontSize: FONTS.large, fontWeight: '700', marginBottom: SPACING.sm, color: COLORS.textPrimary },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.large,
    marginBottom: SPACING.lg,
    color: COLORS.textPrimary,
    borderWidth: 2,
    borderColor: COLORS.border,
    minHeight: 56,
  },
  subtitulo: { textAlign: 'center', color: COLORS.textSecondary, fontSize: FONTS.medium, marginBottom: SPACING.sm },
});
