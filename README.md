# Social icon set for the versafix-1 master template for Mosaico

In order to improve maintainability icon styles are automatically generated from a basic black and white set of social icons.

## SRC
- ```icons-def/``` folder contains a 512x512 B&W icon for each social we support
- ```index.js``` contains the 7 transformations we want to apply.

## GENERATED
- ```icons/``` contains the generated icons that will be used in versafix-1 template (96x96px)
- ```icons-overview/``` contains an overview montage of the generated icons.

### Build/Run

You need NodeJS v6.0 or higher + ImageMagick

```
  npm install
  npm run build
```
