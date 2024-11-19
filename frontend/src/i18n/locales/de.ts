export default {
    common: {
      actions: {
        capture: 'Neues Foto',
        accept: 'Bestätigen',
        retry: 'Wiederholen',
        delete: 'Löschen',
        cancel: 'Abbrechen',
        clear: 'Leeren',
        print: 'Drucken'
      },
      language: {
        select: 'Sprache',
        fr: 'Französisch',
        en: 'Englisch',
        es: 'Spanisch',
        de: 'Deutsch',
        it: 'Italienisch'
      },
      status: {
        queued: 'Ausstehend',
        processing: 'In Bearbeitung',
        completed: 'Abgeschlossen',
        failed: 'Fehlgeschlagen',
        printed: 'Gedruckt'
      }
    },
    gallery: {
      title: 'Ausstehende Bilder',
      clearQueue: 'Warteschlange leeren',
      delete: 'Bild löschen',
      confirmClear: {
        title: 'Bestätigung',
        message: 'Sind Sie sicher, dass Sie die Warteschlange leeren möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
      },
      preview: 'Vorschau',
      version: 'Version {{current}} von {{total}}'
    },
    camera: {
      title: 'Foto aufnehmen',
      startCountdown: 'Countdown starten',
      tooltip: 'Foto aufnehmen'
    },
    notifications: {
      success: {
        title: 'Erfolg',
        queueCleared: 'Warteschlange wurde geleert'
      },
      error: {
        title: 'Fehler',
        clearQueue: 'Warteschlange konnte nicht geleert werden'
      }
    }
  };