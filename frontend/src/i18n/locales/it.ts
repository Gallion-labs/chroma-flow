export default {
    common: {
      actions: {
        capture: 'Nuova Foto',
        accept: 'Conferma',
        retry: 'Riprova',
        delete: 'Elimina',
        cancel: 'Annulla',
        clear: 'Svuota',
        print: 'Stampa'
      },
      language: {
        select: 'Lingua',
        fr: 'Francese',
        en: 'Inglese',
        es: 'Spagnolo',
        de: 'Tedesco',
        it: 'Italiano'
      },
      status: {
        queued: 'In attesa',
        processing: 'In elaborazione',
        completed: 'Completato',
        failed: 'Fallito',
        printed: 'Stampato'
      }
    },
    gallery: {
      title: 'Immagini in attesa',
      clearQueue: 'Svuota coda',
      delete: 'Elimina immagine',
      confirmClear: {
        title: 'Conferma',
        message: 'Sei sicuro di voler svuotare la coda? Questa azione non può essere annullata.'
      },
      preview: 'Anteprima',
      version: 'Versione {{current}} di {{total}}'
    },
    camera: {
      title: 'Scatta una foto',
      startCountdown: 'Avvia conto alla rovescia',
      tooltip: 'Scatta una foto'
    },
    notifications: {
      success: {
        title: 'Successo',
        queueCleared: 'La coda è stata svuotata'
      },
      error: {
        title: 'Errore',
        clearQueue: 'Impossibile svuotare la coda'
      }
    }
  };