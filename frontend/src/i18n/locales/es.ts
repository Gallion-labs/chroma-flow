export default {
    common: {
      actions: {
        capture: 'Nueva Foto',
        accept: 'Aceptar',
        retry: 'Reintentar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        clear: 'Vaciar',
        print: 'Imprimir'
      },
      language: {
        select: 'Idioma',
        fr: 'Francés',
        en: 'Inglés',
        es: 'Español',
        de: 'Alemán',
        it: 'Italiano'
      },
      status: {
        queued: 'Pendiente',
        processing: 'Procesando',
        completed: 'Completado',
        failed: 'Fallido',
        printed: 'Impreso'
      }
    },
    gallery: {
      title: 'Imágenes pendientes',
      clearQueue: 'Vaciar cola',
      delete: 'Eliminar imagen',
      confirmClear: {
        title: 'Confirmación',
        message: '¿Está seguro de que desea vaciar la cola? Esta acción no se puede deshacer.'
      },
      preview: 'Vista previa',
      version: 'Versión {{current}} de {{total}}'
    },
    camera: {
      title: 'Tomar una foto',
      startCountdown: 'Iniciar cuenta atrás',
      tooltip: 'Tomar una foto'
    },
    notifications: {
      success: {
        title: 'Éxito',
        queueCleared: 'La cola ha sido vaciada'
      },
      error: {
        title: 'Error',
        clearQueue: 'No se pudo vaciar la cola'
      }
    }
  };