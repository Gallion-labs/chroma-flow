import { Button, Tooltip } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';

interface CaptureButtonProps {
  onClick: () => void;
}

export function CaptureButton({ onClick }: CaptureButtonProps) {
  return (
    <Tooltip label="Prendre une photo">
      <Button
        leftSection={<IconCamera size={20} />}
        variant="gradient"
        gradient={{ from: 'indigo', to: 'cyan' }}
        className="hover-lift"
        onClick={onClick}
      >
        Nouvelle Photo
      </Button>
    </Tooltip>
  );
}