<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install o npm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo ```__.env.template__``` y renombrar la copia a ```__.env__```

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicación en dev:
```
npm run start:dev / yarn start:dev
```

8. Reconstruir la base de datos con la semilla.
```
http://localhost:3000/api/v2/seed
```


## Stack usado
* MongoDB
* Nest

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de production
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
4. Run la imagen 
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
```

5. Si borramos el contenedor y queremos regenerarlo deberemos usar:
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d 
```



# Notas
Vercel deploy
1. Crear archivo vercel.json
```
{
  "version": 2,
  "buildCommand": "npm start",
  "installCommand": "npm install",
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Requested-With,Accept-Language",
        "Access-Control-Allow-Credentials": "true"
      },
      "dest": "src/main.ts",
      "methods": ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
    }
  ]
}
```
2. Habilitar cors en main.ts
```
app.enableCors({
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization,X-Requested-With,Accept-Language",
  optionsSuccessStatus: 204,
  credentials: true,
});
```
3. Cambiar rutas con src por "../"