# Image légère et fiable
FROM nginx:stable-alpine

# Supprime la conf par défaut et ajoute la tienne
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie uniquement ton site statique (évite d’embarquer des fichiers inutiles)
# Assure-toi que ces chemins existent dans ton contexte docker (à côté du Dockerfile)
COPY index.html /usr/share/nginx/html/
COPY styles.css  /usr/share/nginx/html/
COPY script.js   /usr/share/nginx/html/
COPY assets/     /usr/share/nginx/html/assets/

# (Optionnel) expose le port
EXPOSE 80

# Nginx se lance via l’ENTRYPOINT de l’image officielle, pas besoin d’autre CMD
