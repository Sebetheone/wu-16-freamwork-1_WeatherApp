# Vejrudsigt

En lille dansk vejr-app, der bruger OpenWeatherMap til at finde en by via geokodning og vise dens aktuelle vejr.

## Kom i gang

1. Opret en API-nøgle hos [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Opret en `.env`-fil i projektets rodmappe, og tilføj din nøgle:

   ```env
   VITE_OPENWEATHER_API_KEY=din_api_noegle
   ```

3. Installer afhængigheder, og start udviklingsserveren:

   ```sh
   npm install
   npm run dev
   ```

4. Søg efter en by. Appen bruger OpenWeatherMap Geocoding API til at finde koordinaterne og Current Weather API til at hente vejret.

## Kontrol

```sh
npm run lint
npm run build
```

API-nøglen bruges i browseren og bør derfor have relevante begrænsninger konfigureret hos OpenWeatherMap. Commit ikke `.env`-filen.
