import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ImageGallery } from './components/ImageGallery';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  components: {
    Text: {
      defaultProps: {
        c: 'gray.0'
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
          color: '#C1C2C5'
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
