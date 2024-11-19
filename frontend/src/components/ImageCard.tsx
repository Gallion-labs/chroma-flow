import { Card, Image, Text, Badge, Group } from '@mantine/core';
import { useState } from 'react';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = () => {
    if(image.images.length > 0) { 
      const filename = image.images[currentImageIndex].split('/').pop();
      return `/api/images/${filename}`;
    } else {
      const filename = image.image_path.split('/').pop();
      return `/api/images/${filename}?type=original`;
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      onClick={onClick} 
      className="glass hover-lift"
      style={{ 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <Card.Section>
        <Image
          src={getImageUrl()}
          height={160}
          alt="Image preview"
          fallbackSrc="/placeholder.png"
        />
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
          {image.status}
        </Badge>
      </Group>
    </Card>
  );
}