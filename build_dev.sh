# #!/usr/bin/env bash
# set -e
# echo -e "Default \e[32mGreen"

# GREEN='\033[0;32m'
# NC='\033[0m' # No Color

# printf "${GREEN}Building${NC}...\n"

# npm run build

# printf "${GREEN}Testing...${NC}...\n"

# npm run test

# printf "${GREEN}Webpacking...${NC}...\n"

# npm run pack

# printf "${GREEN}Starting Server...${NC}...\n"

# npm run start 
sudo npm run compileArt-w &
sudo npm run compileAudio-w &
sudo npm run build &
sudo npm run pack &
sudo npm run server