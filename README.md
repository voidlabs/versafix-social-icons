# Social icon set for the versafix-1 master template for Mosaico

In order to improve maintainability icon styles are automatically generated from a basic black and white set of social icons.

## SRC
- ```icons-def/``` folder contains a 512x512 B&W icon for each social we support
- ```index.js``` contains the 7 transformations we want to apply.
![Example source icon](https://github.com/voidlabs/versafix-social-icons/blob/master/icons-def/inst-black-512.png?raw=true)

## GENERATED
- ```icons/``` contains the generated icons that will be used in versafix-1 template (96x96px)
- ```icons-overview/``` contains an overview montage of the generated icons.

> ![48px overview](https://github.com/voidlabs/versafix-social-icons/blob/master/icons-overview/all-48.png?raw=true)
>
> There is also a white logo on transparent background that you won't see in the github preview because of white background page.

### Build/Run

You need NodeJS v6.0 or higher + ImageMagick

```
  npm install
  npm run build
```
