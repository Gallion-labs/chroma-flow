import { Modal, Button, Group, Image } from '@mantine/core';
import { useState } from 'react';
import { CameraPreview } from './CameraPreview';
import { uploadCapture } from '../services/capture.service';
import { useTranslation } from 'react-i18next';

interface CameraModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CameraModal({ opened, onClose }: CameraModalProps) {
  const { t } = useTranslation();
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
      title={t('camera.title')}
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
              {t('common.actions.retry')}
            </Button>
            <Button color="teal" onClick={handleAccept}>
              {t('common.actions.accept')}
            </Button>
          </Group>
        </>
      ) : (
        <CameraPreview onCapture={handleCapture} />
      )}
    </Modal>
  );
}