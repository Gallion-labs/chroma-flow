import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ImageGallery } from './components/ImageGallery';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/texture.css';
import './styles/fonts.css';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'var(--font-primary)',
  headings: {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
  },
  components: {
    Text: {
      defaultProps: {
        c: 'gray.0'
      }
    },
    Button: {
      defaultProps: {
        fw: 600
      },
      styles: {
        root: {
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
        }
      }
    },
    Card: {
      styles: {
        root: {
          backgroundColor: '#25262B',
          '&:hover': {
            backgroundColor: '#2C2E33',
          },
        }
      }
    },
    Modal: {
      styles: {
        title: {
          color: '#C1C2C5',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          letterSpacing: '-0.03em',
        },
        body: {
          color: '#A6A7AB'
        }
      }
    }
  }
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <Notifications />
        <ImageGallery />
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
