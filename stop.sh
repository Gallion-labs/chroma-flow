#!/bin/bash

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Arrêt des services en cours...${NC}"

# Fonction pour vérifier si un processus existe
process_exists() {
    pgrep -f "$1" >/dev/null
    return $?
}

# Arrêter le frontend
if process_exists "vite"; then
    echo -e "${YELLOW}Arrêt du Frontend...${NC}"
    pkill -f "vite"
    sleep 1
    if ! process_exists "vite"; then
        echo -e "${GREEN}Frontend arrêté avec succès${NC}"
    else
        echo -e "${RED}Échec de l'arrêt du Frontend${NC}"
    fi
else
    echo -e "${YELLOW}Frontend n'est pas en cours d'exécution${NC}"
fi

# Arrêter l'API Node.js
if process_exists "node.*app.ts"; then
    echo -e "${YELLOW}Arrêt de l'API Node.js...${NC}"
    pkill -f "node.*app.ts"
    sleep 1
    if ! process_exists "node.*app.ts"; then
        echo -e "${GREEN}API Node.js arrêtée avec succès${NC}"
    else
        echo -e "${RED}Échec de l'arrêt de l'API Node.js${NC}"
    fi
else
    echo -e "${YELLOW}API Node.js n'est pas en cours d'exécution${NC}"
fi

# Arrêter le processor Python
if process_exists "python.*main.py"; then
    echo -e "${YELLOW}Arrêt du processor Python...${NC}"
    pkill -f "python.*main.py"
    sleep 1
    if ! process_exists "python.*main.py"; then
        echo -e "${GREEN}Processor Python arrêté avec succès${NC}"
    else
        echo -e "${RED}Échec de l'arrêt du processor Python${NC}"
    fi
else
    echo -e "${YELLOW}Processor Python n'est pas en cours d'exécution${NC}"
fi

# Arrêter Redis
if brew services list | grep redis | grep started > /dev/null; then
    echo -e "${YELLOW}Arrêt de Redis...${NC}"
    brew services stop redis
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Redis arrêté avec succès${NC}"
    else
        echo -e "${RED}Échec de l'arrêt de Redis${NC}"
    fi
else
    echo -e "${YELLOW}Redis n'est pas en cours d'exécution${NC}"
fi

# Vérification finale
echo -e "\n${YELLOW}Vérification des processus restants...${NC}"
remaining_processes=$(ps aux | grep -E "vite|node.*app.ts|python.*main.py|redis" | grep -v grep)

if [ -n "$remaining_processes" ]; then
    echo -e "${RED}Certains processus sont encore en cours d'exécution :${NC}"
    echo "$remaining_processes"
    echo -e "${YELLOW}Vous pouvez les arrêter manuellement si nécessaire${NC}"
else
    echo -e "${GREEN}Tous les services ont été arrêtés avec succès${NC}"
fi

# Nettoyage optionnel des fichiers temporaires
read -p "Voulez-vous nettoyer les fichiers temporaires ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Nettoyage des fichiers temporaires...${NC}"
    rm -rf data/processed_images/*
    rm -rf data/temp/*
    rm -f logs/*.log
    echo -e "${GREEN}Nettoyage terminé${NC}"
fi
