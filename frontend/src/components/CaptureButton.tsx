import { Button, Tooltip } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface CaptureButtonProps {
  onClick: () => void;
}

export function CaptureButton({ onClick }: CaptureButtonProps) {
  const { t } = useTranslation();
  
  return (
    <Tooltip label={t('camera.tooltip')}>
      <Button
        leftSection={<IconCamera size={20} />}
        variant="gradient"
        gradient={{ from: 'indigo', to: 'cyan' }}
        className="hover-lift"
        onClick={onClick}
      >
        {t('common.actions.capture')}
      </Button>
    </Tooltip>
  );
}