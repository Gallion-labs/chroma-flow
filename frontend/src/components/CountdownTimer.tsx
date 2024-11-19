import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  duration: number;
  onComplete: () => void;
}

export function CountdownTimer({ duration, onComplete }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  return (
    <Text
      size="8rem"
      fw={700}
      ta="center"
      className="countdown-text"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textShadow: '0 0 20px rgba(0,0,0,0.5)',
      }}
    >
      {seconds}
    </Text>
  );
}