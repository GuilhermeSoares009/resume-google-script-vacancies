# Setup

1) Install clasp

```bash
npm i -g @google/clasp
```

2) Login

```bash
clasp login
```

3) Initialize a local project

```bash
clasp create --type standalone --title "cv-automation"
```

4) If a package.json exists, install dependencies

```bash
pnpm install
```

5) Push to Apps Script

```bash
clasp push
```
