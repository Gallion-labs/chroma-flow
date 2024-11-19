import { Box, Button, Grid, Group, Menu, Modal, ScrollArea, Text, Divider } from '@mantine/core';
import { IconDotsVertical, IconTrash, IconLanguage } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { clearQueue, fetchImages } from '../services/api';
import { socket } from '../services/socket';
import { ImageCard } from './ImageCard';
import { ImageSlideshow } from './ImageSlideshow';
import { CaptureButton } from './CaptureButton';
import { CameraModal } from './CameraModal';
import { useImageSelections } from '../hooks/useImageSelections';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

interface Image {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'printed';
  image_path: string;
  created_at: string;
  images: string[];
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

export function ImageGallery() {
  const { clearSelections, setImageSelection } = useImageSelections();
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { t, i18n } = useTranslation();

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
          clearSelections();
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

  const handleVersionSelect = (imageId: string, version: number) => {
    setImageSelection(imageId, version);
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferred-language', langCode);
  };

  return (
    <Box className="texture" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box p="md" className="glass" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Group justify="space-between">
          <Text size="xl" fw={700} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            {t('gallery.title')}
          </Text>
          <Group>
            <CaptureButton onClick={() => setIsCameraOpen(true)} />
            <Menu 
              position="bottom-end" 
              shadow="md"
              styles={{
                dropdown: {
                  backgroundColor: '#25262B',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                },
                item: {
                  color: '#C1C2C5',
                  '&[data-selected]': {
                    backgroundColor: '#2C2E33',
                  },
                },
                label: {
                  color: '#909296',
                }
              }}
            >
              <Menu.Target>
                <Button 
                  variant="subtle" 
                  color="gray"
                  size="md"
                  className="hover-lift"
                >
                  <IconDotsVertical size={20} />
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{t('common.language.select')}</Menu.Label>
                {languages.map((lang) => (
                  <Menu.Item
                    key={lang.code}
                    leftSection={<Text size="lg">{lang.flag}</Text>}
                    rightSection={
                      lang.code === i18n.language && (
                        <Text size="xs" c="dimmed">✓</Text>
                      )
                    }
                    onClick={() => handleLanguageChange(lang.code)}
                    data-selected={lang.code === i18n.language}
                  >
                    <Group justify="space-between" style={{ flex: 1 }}>
                      <Text>{lang.name}</Text>
                      <Text size="xs" c="dimmed">
                        {t(`common.language.${lang.code}`)}
                      </Text>
                    </Group>
                  </Menu.Item>
                ))}
                
                <Divider 
                  my="xs" 
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.05)' 
                  }} 
                />
                
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={handleClearQueue}
                >
                  {t('gallery.clearQueue')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
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
                onSelect={(index) => {
                  setSelectedVersion(index);
                  handleVersionSelect(selectedImage.id, index);
                }}
              />
            </Box>
            <Group justify="flex-end" gap="md">
              <Button
                color="red"
                variant="filled"
                onClick={() => handleDelete(selectedImage)}
              >
                {t('gallery.delete')}
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

      <CameraModal
        opened={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />
    </Box>
  );
}