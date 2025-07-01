FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install --production=false
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]
