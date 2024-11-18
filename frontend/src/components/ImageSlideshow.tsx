import { useState } from 'react';
import { Box, Button, Group, Image, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface ImageSlideshowProps {
  images: string[];
  onSelect?: (index: number) => void;
}

export function ImageSlideshow({ images, onSelect }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    onSelect?.(currentIndex);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    onSelect?.(currentIndex);
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
            alt={`Version ${currentIndex + 1}`}
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
        Version {currentIndex + 1} sur {images.length}
      </Text>
    </Box>
  );
}