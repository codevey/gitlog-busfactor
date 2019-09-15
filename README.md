# Gitlog Busfactor

Calculates the bus factor for each file in your repository from a git log

## Usage

Install gitlog-busfactor

```bash
npm i -g gitlog-busfactor
```

Generate a git log with numstat

```bash
git log --numstat > gitlog.txt
```

Run gitlog busfactor

```bash
gitlog-busfactor --gitlog pathtogitlog
```
