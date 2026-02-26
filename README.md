## Proyecto QA Automation - Banco Credicoop

Proyecto de automatización end‑to‑end con **Playwright + TypeScript** para validar el flujo de login del home banking de Banco Credicoop.

### Requisitos previos

- Node.js 18+ instalado
- npm (incluido con Node)

### Instalación

```bash
npm install
```

Esto instalará Playwright, TypeScript, Allure y demás dependencias de desarrollo.

### Estructura del proyecto

```text
.
├── pages/
│   ├── BasePage.ts        # Clase base POM (navegación y utilidades comunes)
│   └── LoginPage.ts       # Page Object de la pantalla de login
├── tests/
│   └── login.spec.ts      # Casos de prueba de login (TC01–TC05)
├── utils/
│   └── constants.ts       # Constantes compartidas (URLs, longitudes, dominios)
├── playwright.config.ts   # Configuración de Playwright (proyecto Chromium, reporter HTML + Allure)
├── tsconfig.json          # Configuración TypeScript (paths @pages/* y @utils/*)
├── package.json           # Scripts npm y dependencias
└── .gitignore
```

### Scripts principales (npm)

- **`npm test`**: Ejecuta todos los tests de Playwright en modo headless.
- **`npm run test:headed`**: Ejecuta los tests con el navegador visible (útil para debugging visual).
- **`npm run test:ui`**: Abre la UI de Playwright Test Runner.
- **`npm run report`**: Abre el reporte HTML generado por Playwright (`playwright-report`).
- **`npm run allure:generate`**: Genera el reporte de Allure a partir de `allure-results`.
- **`npm run allure:open`**: Abre el reporte Allure en el navegador.
- **`npx playwright show-report

### Alias de imports (TypeScript)

Configurados en `tsconfig.json`:

- **`@pages/*`** → `pages/*`
- **`@utils/*`** → `utils/*`

Ejemplo:

```ts
import { LoginPage } from '@pages/LoginPage';
import { MAX_LENGTH_CLAVE } from '@utils/constants';
```

### Diseño de automatización

- **Patrón Page Object Model (POM)**:  
  `BasePage` y `LoginPage` encapsulan selectores y acciones. Si el banco cambia el front, actualizamos principalmente los Page Objects, manteniendo estables los tests.

- **Casos de prueba actuales (`tests/login.spec.ts`)**:  
  - TC01: Carga de elementos críticos de login.  
  - TC02: Campo clave enmascarado (`type="password"`).  
  - TC03: Validación de longitudes máximas (documento y clave).  
  - TC04: Intento de login vacío (validación frontend).  
  - TC05: Intento de login inválido (happy path negativo manteniendo al usuario en login).

Este README está pensado para entrevistas y handover rápido del proyecto de QA Automation.

### Atajos de teclado

ctrl + f: Para bus car en inpector por xpath, id

npx playwright test --headed
npx playwright test --grep @or
npx playwright show-report