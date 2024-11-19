import { Card, Image, Text, Badge, Group, Tooltip, Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconClick } from '@tabler/icons-react';
import { useImageSelections } from '../hooks/useImageSelections';
import { useTranslation } from 'react-i18next';

interface ImageCardProps {
  image: {
    id: string;
    status: string;
    image_path: string;
    images: string[];
    created_at: string;
  };
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const { t } = useTranslation();
  const { getImageSelection } = useImageSelections();
  const [currentImageIndex, setCurrentImageIndex] = useState(() => 
    getImageSelection(image.id)
  );

  useEffect(() => {
    const selectedIndex = getImageSelection(image.id);
    setCurrentImageIndex(selectedIndex);
  }, [image.id, getImageSelection]);

  const isClickable = image.status === 'completed' || image.status === 'printed';
  const isProcessing = image.status === 'processing';

  const getStatusTranslation = (status: string) => {
    return t(`common.status.${status}`);
  };

  const getImageUrl = () => {
    if(image.images.length > 0) { 
      const filename = image.images[currentImageIndex].split('/').pop();
      return `/api/images/${filename}`;
    } else {
      const filename = image.image_path.split('/').pop();
      return `/api/images/${filename}?type=original`;
    }
  };

  const card = (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      onClick={isClickable ? onClick : undefined} 
      className={`glass ${isClickable ? 'hover-lift' : ''}`}
      style={{ 
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        opacity: isClickable ? 1 : 0.7,
        position: 'relative',
      }}
    >
      <Card.Section style={{ position: 'relative' }}>
        <Image
          src={getImageUrl()}
          height={160}
          alt="Image preview"
          fallbackSrc="/placeholder.png"
        />
        {isClickable && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              transition: 'transform 0.2s ease',
            }}
            className="click-indicator"
          >
            <IconClick size={20} />
          </div>
        )}
        {isProcessing && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <Loader color="blue" size="lg" type="dots" />
          </div>
        )}
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} c="dimmed">
          {new Date(image.created_at).toLocaleString()}
        </Text>
        <Badge color={
          image.status === 'completed' ? 'teal' : 
          image.status === 'printed' ? 'blue' :
          'yellow'
        }>
          {getStatusTranslation(image.status)}
        </Badge>
      </Group>
    </Card>
  );

  return isClickable ? (
    <Tooltip 
      label="Cliquez pour voir les détails" 
      position="bottom"
      transitionProps={{ transition: 'fade', duration: 200 }}
    >
      {card}
    </Tooltip>
  ) : card;
}