import { Modal, Button, Group, Image } from '@mantine/core';
import { useState } from 'react';
import { CameraPreview } from './CameraPreview';
import { uploadCapture } from '../services/capture.service';

interface CameraModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CameraModal({ opened, onClose }: CameraModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
  };

  const handleAccept = async () => {
    if (capturedImage) {
      await uploadCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title="Prendre une photo"
      styles={{
        header: {
          backgroundColor: '#25262B',
        },
        content: {
          backgroundColor: '#1A1B1E',
        }
      }}
    >
      {capturedImage ? (
        <>
          <Image src={capturedImage} radius="md" />
          <Group justify="center" mt="xl">
            <Button color="red" onClick={handleRetry}>
              Recommencer
            </Button>
            <Button color="teal" onClick={handleAccept}>
              Valider
            </Button>
          </Group>
        </>
      ) : (
        <CameraPreview onCapture={handleCapture} />
      )}
    </Modal>
  );
}