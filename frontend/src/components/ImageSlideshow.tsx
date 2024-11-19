import { useState } from 'react';
import { Box, Button, Group, Image, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface ImageSlideshowProps {
  images: string[];
  onSelect?: (index: number) => void;
}

export function ImageSlideshow({ images, onSelect }: ImageSlideshowProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    onSelect?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onSelect?.(newIndex);
  };

  const getImageUrl = (path: string) => {
    const filename = path.split('/').pop();
    return `/api/images/${filename}`;
  };

  return (
    <Box>
      <Group justify="space-between" mb="xs">
        <Button 
          variant="subtle" 
          onClick={handlePrevious}
          disabled={images.length <= 1}
        >
          <IconChevronLeft />
        </Button>
        
        <Box style={{ flex: 1 }}>
          <Image
            src={getImageUrl(images[currentIndex])}
            alt={t('gallery.preview')}
            radius="md"
          />
        </Box>
        
        <Button 
          variant="subtle" 
          onClick={handleNext}
          disabled={images.length <= 1}
        >
          <IconChevronRight />
        </Button>
      </Group>
      
      <Text size="sm" ta="center" c="dimmed">
        {t('gallery.version', { current: currentIndex + 1, total: images.length })}
      </Text>
    </Box>
  );
}