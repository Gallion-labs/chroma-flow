export default {
    common: {
      actions: {
        capture: 'Nouvelle Photo',
        accept: 'Valider',
        retry: 'Recommencer',
        delete: 'Supprimer',
        cancel: 'Annuler',
        clear: 'Vider',
        print: 'Imprimer'
      },
      language: {
        select: 'Langue',
        fr: 'Français',
        en: 'Anglais',
        es: 'Espagnol',
        de: 'Allemand',
        it: 'Italien'
      },
      status: {
        queued: 'En attente',
        processing: 'En cours',
        completed: 'Terminé',
        failed: 'Échec',
        printed: 'Imprimé'
      }
    },
    gallery: {
      title: 'Images en attente',
      clearQueue: 'Vider la file d\'attente',
      delete: 'Supprimer l\'image',
      confirmClear: {
        title: 'Confirmation',
        message: 'Êtes-vous sûr de vouloir vider la file d\'attente ? Cette action est irréversible.'
      },
      preview: 'Aperçu de l\'image',
      version: 'Version {{current}} sur {{total}}'
    },
    camera: {
      title: 'Prendre une photo',
      startCountdown: 'Lancer le compte à rebours',
      tooltip: 'Prendre une photo'
    },
    notifications: {
      success: {
        title: 'Succès',
        queueCleared: 'La file d\'attente a été vidée'
      },
      error: {
        title: 'Erreur',
        clearQueue: 'Impossible de vider la file d\'attente'
      }
    }
  };