import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore SafeStreet</ThemedText>
      </ThemedView>
      <ThemedText>Here’s what powers our platform:</ThemedText>

      <Collapsible title="Smart Reporting System">
        <ThemedText>
          Upload images of damaged roads directly from your device. Our platform handles the rest.
        </ThemedText>
      </Collapsible>

      <Collapsible title="AI-Powered Classification">
        <ThemedText>
          Our Vision Transformer model classifies road conditions and estimates the damage severity.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Realtime Alerts for Authorities">
        <ThemedText>
          Summarized reports are shared instantly via email to the respective authorities for action.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Cross-Platform Support">
        <ThemedText>
          SafeStreet works on Android, iOS, and Web for maximum accessibility and reach.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Custom UI & Dark Mode">
        <ThemedText>
          Enjoy a clean, responsive interface with full light and dark mode support.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
