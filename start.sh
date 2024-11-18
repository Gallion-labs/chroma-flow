#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Démarrage des services...${NC}"

# Définir le chemin absolu du projet
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Créer les dossiers nécessaires
mkdir -p "$PROJECT_DIR/data/images_to_process"
mkdir -p "$PROJECT_DIR/data/processed_images"
mkdir -p "$PROJECT_DIR/data/temp"
mkdir -p "$PROJECT_DIR/logs"
mkdir -p "$PROJECT_DIR/data/scenes"

# Vérifier si Redis est en cours d'exécution
if ! brew services list | grep redis | grep started > /dev/null; then
    echo "Starting Redis..."
    brew services start redis
    sleep 2
fi

# Démarrer l'API
echo -e "${YELLOW}Démarrage de l'API...${NC}"
cd "$PROJECT_DIR/api"
PROCESSED_FOLDER="$PROJECT_DIR/data/processed_images" \
DEFAULT_PRINTER="$(lpstat -d | cut -d ':' -f2 | xargs)" \
npm run dev &

# Démarrer le processor
echo -e "${YELLOW}Démarrage du Processor...${NC}"
cd "$PROJECT_DIR/processor"
source venv/bin/activate
PYTHONPATH="$PROJECT_DIR/processor" \
WATCH_FOLDER="$PROJECT_DIR/data/images_to_process" \
OUTPUT_FOLDER="$PROJECT_DIR/data/processed_images" \
TEMP_FOLDER="$PROJECT_DIR/data/temp" \
python src/main.py &

# Démarrer le frontend
echo -e "${YELLOW}Démarrage du Frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm run dev &

echo -e "${GREEN}Tous les services sont démarrés !${NC}"
echo -e "${YELLOW}Dossier surveillé : $PROJECT_DIR/data/images_to_process${NC}"