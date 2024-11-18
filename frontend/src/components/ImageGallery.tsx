import { Box, Button, Grid, Group, Modal, ScrollArea, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { clearQueue, fetchImages } from '../services/api';
import { socket } from '../services/socket';
import { ImageCard } from './ImageCard';
import { ImageSlideshow } from './ImageSlideshow';

interface Image {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'printed';
  image_path: string;
  created_at: string;
  images: string[];
}

export function ImageGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedVersion, setSelectedVersion] = useState(0);

  useEffect(() => {
    console.log('🔄 Initializing ImageGallery component...');
    
    const loadImages = async () => {
      try {
        console.log('📥 Fetching initial images...');
        const images = await fetchImages();
        console.log('✅ Initial images loaded:', images);
        const sortedImages = images.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setImages(sortedImages);
      } catch (error) {
        console.error('❌ Error fetching images:', error);
      }
    };

    loadImages();

    const handleProcessingUpdate = (update: Image) => {
      console.log('🔄 Received processing update:', update);
      
      setImages(prev => {
        const newImages = [...prev];
        const index = newImages.findIndex(img => img.id === update.id);
        
        if (index === -1) {
          console.log('➕ Adding new image to list');
          return [update, ...newImages];
        }
        
        console.log('🔄 Updating existing image at index:', index);
        newImages[index] = {
          ...newImages[index],
          ...update
        };
        
        console.log('✅ New images list:', newImages);
        return newImages.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    };

    const handleImageDeleted = (imageId: string) => {
      console.log('🗑️ Handling image deletion:', imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleQueueCleared = () => {
      console.log('🧹 Handling queue clear event');
      setImages([]);
    };

    console.log('📡 Setting up socket listeners...');
    socket.on('processing-update', handleProcessingUpdate);
    socket.on('image-deleted', handleImageDeleted);
    socket.on('queue-cleared', handleQueueCleared);

    // Vérifier la connexion socket
    console.log('🔌 Socket connection status:', socket.connected);
    socket.on('connect', () => console.log('🟢 Socket connected'));
    socket.on('disconnect', () => console.log('🔴 Socket disconnected'));
    socket.on('connect_error', (error) => console.log('⚠️ Socket connection error:', error));

    return () => {
      console.log('♻️ Cleaning up socket listeners...');
      socket.off('processing-update', handleProcessingUpdate);
      socket.off('image-deleted', handleImageDeleted);
      socket.off('queue-cleared', handleQueueCleared);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  const handlePrint = async (image: Image) => {
    try {
      await fetch(`/api/print/${image.id}`, { method: 'POST' });
      setImages(prev => prev.map(img => 
        img.id === image.id 
          ? { ...img, status: 'printed' }
          : img
      ));
      setSelectedImage(null);
    } catch (error) {
      console.error('Error printing image:', error);
    }
  };

  const handleDelete = async (image: Image) => {
    try {
      await fetch(`/api/images/${image.id}`, { method: 'DELETE' });
      setImages(prev => prev.filter(img => img.id !== image.id));
      setSelectedImage(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleClearQueue = async () => {
    modals.openConfirmModal({
      title: <Text fw={700}>Confirmation</Text>,
      children: (
        <Text size="sm" c="dimmed">
          Êtes-vous sûr de vouloir vider la file d'attente ? Cette action est irréversible.
        </Text>
      ),
      labels: { confirm: 'Vider', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      cancelProps: { color: 'gray' },
      styles: {
        header: {
          backgroundColor: '#25262B',
        },
        content: {
          backgroundColor: '#1A1B1E',
        }
      },
      onConfirm: async () => {
        try {
          await clearQueue();
          setImages([]);
          notifications.show({
            title: 'Succès',
            message: 'La file d\'attente a été vidée',
            color: 'teal',
            styles: (theme) => ({
              root: {
                backgroundColor: '#25262B',
                borderColor: theme.colors.teal[6],
              },
              title: {
                color: theme.white,
              },
              description: {
                color: theme.colors.gray[0],
              },
            }),
          });
        } catch (error) {
          console.error('Error clearing queue:', error);
          notifications.show({
            title: 'Erreur',
            message: 'Impossible de vider la file d\'attente',
            color: 'red',
            styles: (theme) => ({
              root: {
                backgroundColor: '#25262B',
                borderColor: theme.colors.red[6],
              },
              title: {
                color: theme.white,
              },
              description: {
                color: theme.colors.gray[0],
              },
            }),
          });
        }
      }
    });
  };

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1A1B1E' }}>
      <Box p="md" style={{ borderBottom: '1px solid #2C2E33', background: '#25262B' }}>
        <Group justify="space-between">
          <Text size="xl" fw={700}>Images en attente</Text>
          <Button 
            color="red" 
            variant="outline"
            onClick={handleClearQueue}
          >
            Vider la file d'attente
          </Button>
        </Group>
      </Box>

      <ScrollArea style={{ flex: 1 }} p="md">
        <Grid>
          {images.map((image) => (
            <Grid.Col key={image.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ImageCard
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            </Grid.Col>
          ))}
        </Grid>
      </ScrollArea>

      <Modal
        opened={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        size="xl"
        title={<Text fw={700}>Aperçu de l'image</Text>}
        styles={{
          header: {
            backgroundColor: '#25262B',
          },
          content: {
            backgroundColor: '#1A1B1E',
          }
        }}
      >
        {selectedImage && (
          <>
            <Box 
              style={{ 
                backgroundColor: '#25262B',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <ImageSlideshow 
                images={selectedImage.images}
                onSelect={(index) => setSelectedVersion(index)}
              />
            </Box>
            <Group justify="flex-end" gap="md">
              <Button
                color="red"
                variant="filled"
                onClick={() => handleDelete(selectedImage)}
              >
                Supprimer
              </Button>
              {selectedImage.status === 'completed' || selectedImage.status === 'printed' ? (
                <Button
                  color="teal"
                  variant="filled"
                  onClick={() => handlePrint(selectedImage)}
                >
                  {selectedImage.status === 'printed' 
                    ? 'Imprimer à nouveau'
                    : 'Valider pour impression'
                  }
                </Button>
              ) : null}
            </Group>
          </>
        )}
      </Modal>
    </Box>
  );
}