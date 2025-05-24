# Github support

We need to support Github similar to Zenodo and CKAN.

## References

- https://github.com/frictionlessdata/dplib-py/tree/main/dplib/plugins/github/models
- https://github.com/frictionlessdata/frictionless-py/blob/main/frictionless/portals/github/adapter.py

## Prompts

### 1. Initial implementation

- Port `ckan` package as `github` package (also consult to `zenodo` package)
- Use dplib-py as a reference to adjust github types and process functions
- Use frictionless-py as a reference to adjust `loadPackageFromGithub` and `savePackageToGithub`
- Note that there is no Schema in github domain
