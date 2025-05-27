import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    GestureResponderEvent,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';
import { useSnippets } from '../context/SnippetContext';

const { width, height } = Dimensions.get('window');

export default function FeedScreen() {
  const router = useRouter();
const { snippets, toggleLike, clearSnippets, loading, deleteSnippetById } = useSnippets();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [hasShownEndToast, setHasShownEndToast] = useState(false);
const [visibleIndex, setVisibleIndex] = useState(0);
const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 50,
};

const onViewableItemsChanged = React.useRef(
  ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index ?? 0);
    }
  }
);


  const handleEndReached = useCallback(() => {
    if (!hasShownEndToast && snippets.length > 0) {
      ToastAndroid.show('No more game snippets to show.', ToastAndroid.SHORT);
      setHasShownEndToast(true);
    }
  }, [hasShownEndToast, snippets.length]);

  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      ToastAndroid.show('Refreshing snippets...', ToastAndroid.SHORT);
      // Here you can add your refresh logic if you want to reload snippets
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onLikePress = async (e: GestureResponderEvent, id: string) => {
    e.stopPropagation();
    try {
      await toggleLike(id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderSnippetCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.snippetCard}
      onPress={() => router.push({ pathname: '/snippet/SnippetDetailScreen', params: { id: item.id } })}
      activeOpacity={0.95}
    >
      <View style={styles.previewBox}>
        <Ionicons name="game-controller" size={32} color="#6b7280" />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.gameTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.creatorContainer}>
            {item.creator ? (
              <>
                <Ionicons name="person-circle" size={16} color="#6b7280" />
                <Text style={styles.creator}>{item.creator}</Text>
              </>
            ) : (
              <View />
            )}
          </View>

          <TouchableOpacity
            onPress={(e) => onLikePress(e, item.id)}
            style={[styles.likeButton, item.isLiked && styles.likeButtonActive]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={item.isLiked ? '#ef4444' : '#6b7280'}
            />
            <Text style={[styles.likeText, item.isLiked && styles.likeTextActive]}>
              {item.likes || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="game-controller-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Game Snippets Yet</Text>
      <Text style={styles.emptySubtitle}>Be the first to share your favorite gaming moments!</Text>
    </View>
  );

  const LoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.loadingText}>Loading snippets...</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎮 GameSnips</Text>
        </View>
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 GameSnips</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statsText}>
            {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={snippets}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563eb']}
              tintColor="#2563eb"
            />
          }
          renderItem={renderSnippetCard}
          ListEmptyComponent={EmptyState}
          pagingEnabled
            onViewableItemsChanged={onViewableItemsChanged.current}
  viewabilityConfig={viewabilityConfig}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
           onEndReached={handleEndReached}
    onEndReachedThreshold={0.5}
        />

        {/* Floating Add and Trash Buttons */}
        <View style={styles.floatingButtonGroup}>
          {/* Trash Button */}
          <TouchableOpacity
  style={[styles.floatingButton, styles.trashButton]}
  onPress={() => {
    if (snippets.length === 0) {
      ToastAndroid.show('No snippets to clear.', ToastAndroid.SHORT);
    } else {
      const idToDelete = snippets[visibleIndex]?.id;
      if (idToDelete) {
        deleteSnippetById(idToDelete);
        ToastAndroid.show('Snippet deleted.', ToastAndroid.SHORT);
      }
    }
  }}
  activeOpacity={0.8}
>
  <Ionicons name="trash" size={24} color="#ffffff" />
</TouchableOpacity>


          {/* Add Button */}
          <TouchableOpacity
            style={[styles.floatingButton, styles.addButton]}
            onPress={() => router.push('/create-snippet')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerStats: {
    marginTop: 4,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContainer: {
    // No extra padding needed to ensure full screen snapping
  },
  snippetCard: {
    backgroundColor: '#ffffff',
    width: width,
    height: height,
    padding: 16,
    justifyContent: 'flex-start',
  },
  previewBox: {
    width: '100%',
    height: height * 0.6,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardContent: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
    lineHeight: 24,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creator: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  likeButtonActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  likeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#6b7280',
  },
  likeTextActive: {
    color: '#ef4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2563eb',
  },
  floatingButtonGroup: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  floatingButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  trashButton: {
    backgroundColor: '#ef4444',
  },
  addButton: {
    backgroundColor: '#2563eb',
  },
});
