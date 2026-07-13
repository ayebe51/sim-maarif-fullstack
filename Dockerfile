# Tahap 1: Build Frontend (Node.js)
FROM node:20-alpine AS builder

WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Menginstal dependensi
RUN npm ci

# Menyalin seluruh kode ke dalam container
COPY . .

# Variabel Lingkungan Saat Build
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL

# Melakukan Build
RUN npm run build

# Tahap 2: Serving menggunakan Nginx
FROM nginx:alpine

# Menyalin file konfigurasi nginx khusus untuk React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Menyalin hasil build dari tahap 1 ke direktori Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mengekspos port 80
EXPOSE 80

# Menjalankan nginx
CMD ["nginx", "-g", "daemon off;"]
