# Pantry Alchemy

**Cook with what you've got.**

Pantry Alchemy is a mobile-first recipe planner built with Expo (React Native). Point your camera at groceries or your pantry, and the app identifies ingredients using a custom-trained YOLO model, then matches them against Filipino recipes, builds a weekly meal plan, and generates a grocery list for anything you're missing.

---

## Project structure

```
Pantry-Alchemy/
├── prototype/
│   └── sahog_prototype.html   ← read-only Figma/source-of-truth reference (do not edit)
├── src/
│   ├── app/                   ← Expo Router screens
│   │   ├── _layout.tsx        ← root Stack (fonts, providers)
│   │   ├── index.tsx          ← Login
│   │   ├── (tabs)/            ← Pantry, Recipes, Planner, Grocery List
│   │   ├── scan.tsx           ← Camera / gallery picker
│   │   ├── scanning.tsx       ← Detection loading state
│   │   ├── confirm.tsx        ← Review detected ingredients
│   │   └── recipe/[id].tsx    ← Recipe detail
│   ├── components/            ← Chip, RecipeCard, MatchRing, DayRow, Receipt…
│   ├── context/               ← PantryContext, PlanContext, GroceryContext (AsyncStorage)
│   ├── data/                  ← recipes.ts (7 recipes), ingredientMap.ts (64 classes), grocery.ts (prices)
│   ├── utils/                 ← matching.ts, server.ts, storage.ts
│   └── theme.ts               ← colors, fonts, radii, shadows
├── assets/
├── eas.json                   ← EAS build profiles (development/preview/production)
├── .env.example               ← Copy to `.env` to set EXPO_PUBLIC_API_BASE_URL
├── app.json
├── package.json
└── tsconfig.json
```

The `prototype/` directory is preserved as the original HTML source-of-truth. It is **not shipped** with the app; it exists for visual comparison and rollback only.

---

## Getting started (development)

```bash
npm install
npm start
```

Open the Expo Go app on your phone (same Wi-Fi as your PC) or press `i`/`a` for simulators.

Start the FastAPI detection server locally (see below) and point the app at it:

```bash
# copy then edit
cp .env.example .env
```

| Scenario | `EXPO_PUBLIC_API_BASE_URL` |
|---|---|
| Same Wi-Fi as your PC | `http://<YOUR-LAN-IP>:8000` |
| Any network (tunnel) | `https://<tunnel-url>` |

If you don't set it, the app falls back to `http://192.168.1.100:8000`.

---

## Ingredient detection server

The camera scan feature calls a FastAPI inference server running your custom-trained YOLO26s ingredient detector.

**Prerequisites:** Python 3.11+, NVIDIA GPU, the [ingredient-detector](../ingredient-detector) project.

```bash
cd ../ingredient-detector
pip install -r Image_ingridient_detection_model/requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

The server exposes `POST /detect` (multipart `file` field, optional `?conf=0.30`), plus a `GET /health` endpoint to verify it is reachable.

The model's 64 ingredient classes are mapped to app-compatible names via `src/data/ingredientMap.ts`.

---

## Making the app downloadable

### 1. Get the detection server reachable "anywhere"

Your PC hosts the model, so to let phones on **other** Wi-Fi networks scan, expose FastAPI with a free tunnel (no router configuration, no public IP):

```bash
# Cloudflare Tunnel (recommended — gives you an HTTPS URL)
winget install Cloudflare.cloudflared        # one time
cloudflared tunnel --url http://127.0.0.1:8000

# or ngrok
# ngrok http 8000
```

The command prints an URL like `https://xxxx.trycloudflare.com`. Set it as `EXPO_PUBLIC_API_BASE_URL`, then restart Expo with `npx expo start --clear`.

> Use HTTPS. iOS blocks plain HTTP by default (ATS) and Android block cleartext in release builds. The tunnel solves both.
>
> **Trade-off:** your PC, FastAPI server, and tunnel must all be running whenever someone scans. Fine for personal/family use; for a public store app you'd eventually host `api/main.py` in the cloud.

### 2. Build a shareable install link (EAS)

```bash
npm install -g eas-cli   # one time
eas login                # free Expo account
npm run build:android    # APK + shareable link/QR for Android
npm run build:ios        # TestFlight build (requires Apple Developer, $99/yr)
```

- **Android:** `eas build` produces an installable **APK** and a link/QR to share. Testers install it directly (allow "install unknown apps").
- **iOS:** the build compiles in the cloud (no Mac needed) and is distributed through **TestFlight**, which requires an Apple Developer account.
- The first build will register the project with EAS and may ask you to confirm the `android.package` / `ios.bundleIdentifier` values already set in `app.json` (`com.pantryalchemy.app`).

`eas.json` already defines three profiles:

| Profile | Purpose | Command |
|---|---|---|
| `development` | Dev client with Metro debugging | `eas build --profile development` |
| `preview` | Shareable APK / TestFlight builds | `npm run build:android` / `npm run build:ios` |
| `production` | Store-ready signed builds | `npm run build:android:store` / `npm run build:ios:store` |

### 3. Public store releases (later)

- **Google Play** — `npm run build:android:store` produces an `.aab`; upload to the Play Console (one-time $25 fee, new accounts first complete a closed-testing phase with ~20 testers).
- **App Store** — `npm run build:ios:store` produces a production `.ipa`; submit through App Store Connect → TestFlight → review ($99/yr).
- Both stores exercise the **full scanning flow over the internet**, so a reliable HTTPS endpoint for the detection server is required before submitting.

> **Before your first share:** replace the placeholder Expo icon/splash in `assets/images/` (`icon.png`, `splash-icon.png`, adaptive icon PNGs) with Pantry Alchemy artwork. They currently use the default Expo template. Keep `version` in `app.json` in sync with `package.json`.

---

## Lint & typecheck

```bash
npm run lint        # ESLint (expo config)
npm run typecheck   # tsc --noEmit
```

---

## Troubleshooting

**Detection fails / timeout:**
- Verify `curl http://<API_BASE_URL>/health` returns `{"status":"ok",...}` from the phone's network.
- On LAN, Windows Firewall may block port 8000 — allow Python through.
- Off-network, make sure `cloudflared`/`ngrok` is still running.

**Camera not working:**
- Grant camera permission on the device.
- Rebuild after changing `app.json` permission strings (they're baked into the native project).

**Reset local data:**
- Pantry, plan, and grocery data live in AsyncStorage (`pa:pantry`, `pa:plan`, `pa:grocery`). Clear app storage or reinstall to reset.

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/` | Demo auth screen |
| Pantry | `/(tabs)/pantry` | Manage ingredients, scan card |
| Recipes | `/(tabs)/recipes` | Filter by match %, under 30, vegetarian |
| Recipe Detail | `/recipe/[id]` | Ingredients (have/missing), steps, add to plan |
| Planner | `/(tabs)/planner` | 7-day meal plan with swap |
| Grocery List | `/(tabs)/list` | Receipt-style checkable list |
| Scan | `/scan` | Camera viewfinder + gallery upload |
| Scanning | `/scanning` | Detection in progress |
| Confirm | `/confirm` | Review & toggle detected ingredients |