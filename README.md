# Automate git cherry-pick of multiple commits

## Description

Cherry pick several commits that match a regex pattern.

## Synopsis

```
Git cherry pick multiple commits.
Usage: gcpk

Options:
  -o, --origin   Origin branch (defaults to the current branch)
  -d, --dest     Destination branch                              [required]
  -p, --pattern  Pattern to match when searching for commits     [required]
  -t, --test     Test run just to see selected commits           [boolean]

```

## Install

```
$ npm install gcpk -g
```

## License

MIT
