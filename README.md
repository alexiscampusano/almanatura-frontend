# Alma Natura - Frontend

Frontend del proyecto Alma Natura, construido con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS v4**.

---

## Requisitos previos

- **Node.js** >= 22 (ver `.nvmrc`). Se recomienda usar [nvm](https://github.com/nvm-sh/nvm) para gestionar versiones:
  ```bash
  nvm install
  nvm use
  ```
- **npm** (viene incluido con Node)
- **Git**

---

## Instalacion

```bash
# 1. Clonar el repositorio
git clone https://github.com/alexiscampusano/almanatura-frontend
cd almanatura-frontend

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

La app estara disponible en `http://localhost:5173`.

---

## Scripts disponibles

| Script                 | Comando                | Descripcion                                                     |
| ---------------------- | ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | `vite`                 | Levanta el servidor de desarrollo con HMR                       |
| `npm run build`        | `tsc -b && vite build` | Compila TypeScript y genera el bundle de produccion             |
| `npm run preview`      | `vite preview`         | Previsualiza el build de produccion localmente                  |
| `npm run lint`         | `eslint .`             | Ejecuta ESLint para detectar errores de codigo                  |
| `npm run lint:fix`     | `eslint . --fix`       | Ejecuta ESLint y corrige automaticamente lo que pueda           |
| `npm run format`       | `prettier --write .`   | Formatea todos los archivos con Prettier                        |
| `npm run format:check` | `prettier --check .`   | Verifica que todos los archivos esten formateados (usado en CI) |
| `npm run typecheck`    | `tsc -b --noEmit`      | Verifica tipos de TypeScript sin generar archivos               |

### Cuando usar cada script

- **Antes de commitear**: no necesitas ejecutar nada manualmente, Husky + lint-staged lo hacen por ti en cada commit.
- **Para verificar todo manualmente**: `npm run format:check && npm run lint && npm run typecheck`.
- **Para corregir formato y lint de una vez**: `npm run format && npm run lint:fix`.

---

## Flujo de trabajo con Git

### Ramas principales

| Rama   | Proposito                                                              |
| ------ | ---------------------------------------------------------------------- |
| `main` | **Produccion**. Codigo estable y listo para desplegar. Rama protegida. |
| `dev`  | **Integracion**. Aqui se mergean las features. Base para nuevas ramas. |

### Tipos de ramas de trabajo

Las ramas se crean **siempre desde `dev`** y se nombran segun la tarea asignada en ClickUp:

| Prefijo     | Uso                       | Ejemplo                                |
| ----------- | ------------------------- | -------------------------------------- |
| `feat/`     | Nueva funcionalidad       | `feat/frontend-statistics-integration` |
| `fix/`      | Correccion de bugs        | `fix/navbar-responsive-issue`          |
| `refactor/` | Refactorizacion de codigo | `refactor/api-service-structure`       |
| `docs/`     | Documentacion             | `docs/update-readme`                   |
| `chore/`    | Tareas de mantenimiento   | `chore/update-dependencies`            |

### Commits (Conventional Commits)

Los mensajes de commit siguen el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(alcance): descripcion corta
```

Ejemplos:

```
feat(frontend): fetch and display dynamic statistics
fix(auth): handle expired token redirect
refactor(api): extract http client to shared module
docs(readme): add deployment instructions
chore(deps): update tailwindcss to v4.3
```

---

## Flujo diario de trabajo

**IMPORTANTE**: Antes de empezar a programar, siempre actualiza tu rama local.

### 1. Actualizar `dev`

```bash
git checkout dev
git pull origin dev
```

### 2. Crear tu rama de trabajo

Segun la tarea asignada en ClickUp:

```bash
git checkout -b feat/nombre-de-la-tarea
```

### 3. Desarrollar y commitear

Trabaja en tu tarea. Al hacer commit, Husky ejecuta automaticamente lint y format sobre los archivos modificados:

```bash
git add .
git commit -m "feat(frontend): descripcion de lo que hiciste"
```

Si el commit falla por errores de lint o formato, revisa los mensajes de error, corrige y vuelve a commitear.

### 4. Subir tu rama

```bash
git push origin feat/nombre-de-la-tarea
```

### 5. Crear un Pull Request (PR)

1. Ve a GitHub y crea un **Pull Request** desde tu rama hacia `dev`.
2. En la descripcion del PR incluye:
   - Que hace el cambio
   - Número de la tarea de ClickUp (si aplica)
   - Capturas de pantalla si es un cambio visual
3. El **CI se ejecuta automaticamente** y verifica: formato, lint, tipos y build.
4. Si el CI falla, revisa los logs en la pestana "Actions" del PR y corrige.
5. Espera la revision de un companero (si aplica) y luego mergea.

### 6. Despues del merge

```bash
git checkout dev
git pull origin dev
# Tu rama ya fue mergeada, puedes eliminarla localmente:
git branch -d feat/nombre-de-la-tarea
```

---

## Estructura del proyecto

```
alma-natura-frontend/
├── .github/workflows/   # CI con GitHub Actions
├── .husky/              # Hooks de Git (pre-commit)
├── .vscode/             # Configuracion compartida del editor
├── public/              # Archivos estaticos
├── src/
│   ├── App.tsx          # Componente raiz
│   ├── App.css          # Estilos del componente raiz
│   ├── index.css        # Estilos globales + Tailwind
│   ├── main.tsx         # Entry point de React
│   └── assets/          # Imagenes, iconos, etc.
├── .editorconfig        # Reglas de formato del editor
├── .eslintrc            # (no existe, se usa eslint.config.js)
├── .nvmrc               # Version de Node
├── .prettierrc          # Configuracion de Prettier
├── eslint.config.js     # Configuracion de ESLint (flat config)
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuracion de TypeScript
└── vite.config.ts       # Configuracion de Vite
```

---

## Herramientas configuradas

- **ESLint**: analisis estatico de codigo con reglas para TypeScript, React Hooks y React Refresh.
- **Prettier**: formateo automatico de codigo.
- **Husky + lint-staged**: ejecuta lint y format automaticamente en cada commit (solo sobre archivos modificados).
- **GitHub Actions CI**: valida formato, lint, tipos y build en cada push y PR a `main` y `dev`.
- **EditorConfig**: consistencia de indentacion y finales de linea entre editores.
- **VS Code settings**: format on save y extensiones recomendadas incluidas en el repo.
