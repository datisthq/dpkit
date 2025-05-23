# Zenodo Support

We need to support Zenodo data repository for loading and saving data packages.

## Tasks

- Port `ckan` package structure to `zenodo` package
- Use dplib-py's models  to implement types and processors (normalize/denormalize)
-  Use frictionless-py's Zenodo API related logic to implement `savePackageToZenodo` and `loadPackageFromZenodo`
- Don't write specs for now
- Ensure that linting and type checking pass

## References

- https://github.com/frictionlessdata/dplib-py/tree/main/dplib/plugins/zenodo/models
- https://github.com/frictionlessdata/frictionless-py/tree/main/frictionless/portals/zenodo
- https://developers.zenodo.org/#rest-api
