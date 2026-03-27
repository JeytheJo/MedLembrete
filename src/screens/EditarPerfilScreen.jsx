import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert, Image, ScrollView,
  StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import BotaoAcessivel from '../components/BotaoAcessivel';
import BotaoVoltar from '../components/BotaoVoltar';
import { COLORS, FONTS, MIN_TOUCH, SPACING } from '../constants/theme';
import db from '../database/database';

export default function EditarPerfilScreen({ idUsuario, onSalvar, onVoltar }) {
  const perfil = db.getFirstSync('SELECT * FROM perfil_usuario WHERE id_usuario = ?', [idUsuario]);

  const [nome, setNome] = useState(perfil?.name || '');
  const [idade, setIdade] = useState(perfil?.idade || '');
  const [descricao, setDescricao] = useState(perfil?.descricao || '');
  const [foto, setFoto] = useState(perfil?.foto_path || null);

  const formularioValido = nome.trim().length > 0 && idade.trim().length > 0;

  async function escolherFoto() {
    Alert.alert(
      'Foto de perfil',
      'Como deseja adicionar a foto?',
      [
        {
          text: 'Câmera',
          onPress: async () => {
            const permissao = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissao.granted) {
              Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) setFoto(result.assets[0].uri);
          }
        },
        {
          text: 'Galeria',
          onPress: async () => {
            const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissao.granted) {
              Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) setFoto(result.assets[0].uri);
          }
        },
        { text: 'Remover foto', style: 'destructive', onPress: () => setFoto(null) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  }

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
      `UPDATE perfil_usuario SET name=?, idade=?, descricao=?, foto_path=? WHERE id_usuario=?`,
      [nome.trim(), idade.trim(), descricao.trim(), foto || '', idUsuario]
    );
    Alert.alert('Sucesso!', 'Perfil atualizado com sucesso.', [
      { text: 'OK', onPress: onSalvar }
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <BotaoVoltar onPress={onVoltar} />
      <Text style={styles.titulo}>Editar Perfil</Text>

      <TouchableOpacity style={styles.avatarContainer} onPress={escolherFoto} activeOpacity={0.8}>
        <View style={styles.avatar}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatarFoto} />
          ) : (
            <Text style={styles.avatarTexto}>{nome.charAt(0).toUpperCase() || '?'}</Text>
          )}
        </View>
        <Text style={styles.avatarDica}>Alterar foto de perfil?</Text>
      </TouchableOpacity>

      <Text style={styles.secao}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do idoso"
        placeholderTextColor={COLORS.textMuted}
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />

      <Text style={styles.secao}>Idade</Text>
      <TextInput
        style={styles.input}
        placeholder="Idade"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="numeric"
        value={idade}
        onChangeText={setIdade}
        maxLength={3}
      />

      <Text style={styles.secao}>Descrição rápida</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Ex: Gosta de caminhadas pela manhã..."
        placeholderTextColor={COLORS.textMuted}
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={3}
      />

      <BotaoAcessivel
        titulo="Salvar alterações"
        onPress={salvar}
        desabilitado={!formularioValido}
        style={{ marginTop: SPACING.lg }}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  titulo: { fontSize: FONTS.title, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  avatarContainer: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  avatarFoto: { width: 100, height: 100, borderRadius: 50 },
  avatarTexto: { fontSize: 48, color: COLORS.white, fontWeight: 'bold' },
  avatarDica: { fontSize: FONTS.medium, color: COLORS.textSecondary },
  secao: { fontSize: FONTS.medium, fontWeight: '700', color: COLORS.textSecondary, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.large,
    color: COLORS.textPrimary,
    borderWidth: 2,
    borderColor: COLORS.border,
    minHeight: MIN_TOUCH,
  },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
});
