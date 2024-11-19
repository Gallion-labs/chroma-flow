import { Box, Button, Group } from '@mantine/core';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { CountdownTimer } from './CountdownTimer';
import { IconCamera } from '@tabler/icons-react';

interface CameraPreviewProps {
  onCapture: (imageSrc: string) => void;
}

export function CameraPreview({ onCapture }: CameraPreviewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const handleStartCapture = useCallback(() => {
    setIsCountingDown(true);
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
    setIsCountingDown(false);
  }, [onCapture]);

  return (
    <Box pos="relative">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user"
        }}
        style={{
          width: '100%',
          borderRadius: '8px',
        }}
      />
      
      {isCountingDown ? (
        <CountdownTimer duration={10} onComplete={capture} />
      ) : (
        <Group justify="center" mt="md">
          <Button
            size="lg"
            leftSection={<IconCamera size={20} />}
            onClick={handleStartCapture}
          >
            Lancer le compte à rebours
          </Button>
        </Group>
      )}
    </Box>
  );
}