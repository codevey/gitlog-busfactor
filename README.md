# Gitlog Busfactor

Calculates the bus factor for each file in your repository from a git log

[![CircleCI](https://circleci.com/gh/codevey/gitlog-busfactor.svg?style=svg)](https://circleci.com/gh/codevey/gitlog-busfactor)

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
