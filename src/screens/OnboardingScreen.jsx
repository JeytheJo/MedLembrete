import { Modak_400Regular, useFonts } from '@expo-google-fonts/modak';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { COLORS, FONTS, SPACING } from '../constants/theme';

function Slide({ emoji }) {
  return (
    <View style={styles.slide}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

function BotaoPular({ onPress }) {
  return (
    <TouchableOpacity style={styles.botaoPular} onPress={onPress}>
      <Text style={styles.botaoPularTexto}>Pular</Text>
    </TouchableOpacity>
  );
}

function BotaoProximo({ onPress }) {
  return (
    <TouchableOpacity style={styles.botaoProximo} onPress={onPress}>
      <Text style={styles.botaoProximoTexto}>Próximo</Text>
    </TouchableOpacity>
  );
}

function BotaoComecar({ onPress }) {
  return (
    <TouchableOpacity style={styles.botaoProximo} onPress={onPress}>
      <Text style={styles.botaoProximoTexto}>Começar agora</Text>
    </TouchableOpacity>
  );
}

export default function OnboardingScreen({ onTerminar }) {
  const [fontsLoaded] = useFonts({ Modak_400Regular });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <Onboarding
        onSkip={onTerminar}
        onDone={onTerminar}
        SkipButtonComponent={BotaoPular}
        NextButtonComponent={BotaoProximo}
        DoneButtonComponent={BotaoComecar}
        bottomBarColor={COLORS.white}
        bottomBarHeight={100}
        dotStyle={styles.dot}
        activeDotStyle={styles.dotAtivo}
        pages={[
          {
            backgroundColor: COLORS.white,
            image: (
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/icon.png')}
                  style={styles.logoIcone}
                />
                <View style={styles.logoTextoContainer}>
                  <Text style={styles.logoTo}>Tô </Text>
                  <Text style={styles.logoLembrado}>Lembrado</Text>
                </View>
              </View>
            ),
            title: 'Bem vindo!',
            subtitle: 'O app que ajuda cuidadores a não esquecer nenhum detalhe dos seus idosos.',
            titleStyles: styles.paginaTitulo,
            subTitleStyles: styles.paginaSubtitulo,
          },
          {
            backgroundColor: '#f0f4ff',
            image: <Slide emoji="👤" />,
            title: 'Cadastre os perfis',
            subtitle: 'Adicione um perfil para cada idoso que você cuida, com nome, idade e uma foto.',
            titleStyles: styles.paginaTitulo,
            subTitleStyles: styles.paginaSubtitulo,
          },
          {
            backgroundColor: COLORS.white,
            image: <Slide emoji="💊" />,
            title: 'Adicione tarefas',
            subtitle: 'Cadastre medicamentos, horários de refeição, medição de pressão e muito mais.',
            titleStyles: styles.paginaTitulo,
            subTitleStyles: styles.paginaSubtitulo,
          },
          {
            backgroundColor: '#f0f4ff',
            image: <Slide emoji="🔔" />,
            title: 'Receba lembretes',
            subtitle: 'O app avisa no horário certo, mesmo com a tela bloqueada. Nunca mais esqueça!',
            titleStyles: styles.paginaTitulo,
            subTitleStyles: styles.paginaSubtitulo,
          },
          {
            backgroundColor: COLORS.white,
            image: <Slide emoji="📋" />,
            title: 'Acompanhe o histórico',
            subtitle: 'Veja tudo que foi realizado nos últimos 7 dias e mantenha o controle completo.',
            titleStyles: styles.paginaTitulo,
            subTitleStyles: styles.paginaSubtitulo,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.white },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  emoji: { fontSize: 100 },
  logoContainer: { alignItems: 'center' },
  logoIcone: { width: 120, height: 120, resizeMode: 'contain', marginBottom: SPACING.sm },
  logoTextoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoTo: { fontSize: 36, fontFamily: 'Modak_400Regular', color: '#1A3CFF' },
  logoLembrado: { fontSize: 36, fontFamily: 'Modak_400Regular', color: '#FF7474' },
  paginaTitulo: { fontSize: FONTS.title, fontWeight: 'bold', color: COLORS.textPrimary },
  paginaSubtitulo: { fontSize: FONTS.large, color: COLORS.textSecondary, paddingHorizontal: SPACING.lg, textAlign: 'center' },
  dot: { backgroundColor: COLORS.border, width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  dotAtivo: { backgroundColor: COLORS.primary, width: 20, height: 8, borderRadius: 4, marginHorizontal: 4 },
  botaoPular: {
    marginLeft: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
  },
  botaoPularTexto: { fontSize: FONTS.large, color: COLORS.primary, fontWeight: 'bold' },
  botaoProximo: {
    marginRight: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  botaoProximoTexto: { fontSize: FONTS.large, color: COLORS.white, fontWeight: 'bold' },
});
