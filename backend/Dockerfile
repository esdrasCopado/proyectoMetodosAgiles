# Usa una imagen base oficial de Node.js
FROM node:20.11.0

# Crea el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el contenido del proyecto
COPY . .

# Expone el puerto en el que la app estará corriendo
EXPOSE 3000

# Comando por defecto para correr la aplicación
CMD ["node", "index.js"]
