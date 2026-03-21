import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, MIN_TOUCH } from '../constants/theme';

export default function BotaoAcessivel({
  titulo,
  onPress,
  desabilitado = false,
  variante = 'primario',
  style,
}) {
  const estiloVariante = {
    primario: { backgroundColor: desabilitado ? COLORS.disabled : COLORS.primary },
    secundario: { backgroundColor: COLORS.surface, borderWidth: 2, borderColor: COLORS.primary },
    perigo: { backgroundColor: desabilitado ? COLORS.disabled : COLORS.danger },
  }[variante];

  const estiloTexto = {
    primario: { color: COLORS.white },
    secundario: { color: COLORS.primary },
    perigo: { color: COLORS.white },
  }[variante];

  return (
    <TouchableOpacity
      style={[styles.botao, estiloVariante, style]}
      onPress={onPress}
      disabled={desabilitado}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado }}
    >
      <Text style={[styles.texto, estiloTexto]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: MIN_TOUCH,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  texto: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
});
