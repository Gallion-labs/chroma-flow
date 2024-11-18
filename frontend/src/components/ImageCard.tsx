import { Card, Image, Text, Badge, Group } from '@mantine/core';

interface ImageCardProps {
  image: {
    id: string;
    status: string;
    image_path: string;
    created_at: string;
  };
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const getImageUrl = () => {
    const filename = image.image_path.split('/').pop();
    if (image.status === 'completed') {
      return `/api/images/${filename}`;
    }
    // Pour les images en cours de traitement, utiliser l'image originale
    return `/api/images/${filename}/original`;
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      onClick={onClick} 
      style={{ 
        cursor: 'pointer',
        backgroundColor: '#25262B',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }
      }}
    >
      <Card.Section>
        <Image
          src={getImageUrl()}
          height={160}
          alt="Image preview"
          fallbackSrc="/placeholder.png" // Optionnel : une image par défaut en cas d'erreur
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