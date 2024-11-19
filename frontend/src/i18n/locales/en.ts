export default {
    common: {
      actions: {
        capture: 'New Photo',
        accept: 'Accept',
        retry: 'Retry',
        delete: 'Delete',
        cancel: 'Cancel',
        clear: 'Clear',
        print: 'Print'
      },
      language: {
        select: 'Language',
        fr: 'French',
        en: 'English',
        es: 'Spanish',
        de: 'German',
        it: 'Italian'
      },
      status: {
        queued: 'Pending',
        processing: 'Processing',
        completed: 'Completed',
        failed: 'Failed',
        printed: 'Printed'
      }
    },
    gallery: {
      title: 'Pending Images',
      clearQueue: 'Clear Queue',
      delete: 'Delete Image',
      confirmClear: {
        title: 'Confirmation',
        message: 'Are you sure you want to clear the queue? This action cannot be undone.'
      },
      preview: 'Image Preview',
      version: 'Version {{current}} of {{total}}'
    },
    camera: {
      title: 'Take a Photo',
      startCountdown: 'Start Countdown',
      tooltip: 'Take a photo'
    },
    notifications: {
      success: {
        title: 'Success',
        queueCleared: 'Queue has been cleared'
      },
      error: {
        title: 'Error',
        clearQueue: 'Unable to clear queue'
      }
    }
  };