---
description: Next.js supports including CSS files as Global CSS or CSS Modules, using `styled-jsx` for CSS-in-JS, or any other CSS-in-JS solution! Learn more here.
---

# Built-In CSS Support

Next.js allows you to import CSS files from a JavaScript file. This is possible because Next.js extends the concept of `import` beyond JavaScript.

## Adding a Stylesheet

To add a stylesheet to your application, start by creating a css file, we'll use `styles.css` for the following example:

```css
body {
  font-family: 'SF Pro Text', 'SF Pro Icons', system-ui;
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

Then import the CSS file within [`pages/_app.js`](docs\advanced-features\custom-app.md):

```jsx
import '../styles.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

In this case, styles in `styles.css` are not scoped and will affect all pages and components inside your application.

Due to the nature of global styles, and to avoid conflicts, you can only place them inside [`pages/_app.js`](docs\advanced-features\custom-app.md), which is a wrapper for all pages.

In development, expressing stylesheets this way allows your styles to be hot reloaded as you edit them—meaning you can keep application state.

In production, all CSS files will be automatically concatenated into a single minified `.css` file.

## Adding Component-Level CSS

Next.js supports [CSS Modules](https://github.com/css-modules/css-modules) using the `[name].module.css` file naming convention.

CSS Modules locally scope CSS by automatically creating a unique class name. This allows you to use the same CSS class name in different files without worrying about collisions.

This behavior makes CSS Modules the ideal way to include component-level CSS. CSS Module files **can be imported anywhere in your application**.

For example:

### `components/Button.module.css`

```css
/*
You do not need to worry about .error {} colliding with any other `.css` or
`.module.css` files!
*/
.error {
  color: white;
  background-color: red;
}
```

### `components/Button.js`

```jsx
import styles from './Button.module.css'

export function Button() {
  return (
    <button type="button" className={styles.error}>
      Destroy
    </button>
  )
}
```

CSS Modules are an _optional feature_. Regular `<link>` stylesheets and CSS files are fully supported.

CSS Modules are **only enabled for files with the `.module.css` extension**.

In production, all CSS Module files will be automatically concatenated into **many minified and code-split** `.css` files. These `.css` files represent hot execution paths in your application, ensuring the minimal amount of CSS is loaded for your application to paint.

## CSS-in-JS

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="https://github.com/zeit/next.js/tree/canary/examples/basic-css">Styled JSX</a></li>
    <li><a href="https://github.com/zeit/next.js/tree/canary/examples/with-styled-components">Styled Components</a></li>
    <li><a href="https://github.com/zeit/next.js/tree/canary/examples/with-styletron">Styletron</a></li>
    <li><a href="https://github.com/zeit/next.js/tree/canary/examples/with-glamor">Glamor</a></li>
    <li><a href="https://github.com/zeit/next.js/tree/canary/examples/with-cxs">Cxs</a></li>
    <li><a href="https://github.com/zeit/next.js/tree/canary/examples/with-aphrodite">Aphrodite</a></li>
    <li><a href="https://github.com/zeit/next.js/tree/canary/examples/with-fela">Fela</a></li>
  </ul>
</details>

It's possible to use any existing CSS-in-JS solution. The simplest one is inline styles:

```jsx
function HiThere() {
  return <p style={{ color: 'red' }}>hi there</p>
}

export default HiThere
```

We bundle [styled-jsx](https://github.com/zeit/styled-jsx) to provide support for isolated scoped CSS. The aim is to support "shadow CSS" similar to Web Components, which unfortunately [do not support server-rendering and are JS-only](https://github.com/w3c/webcomponents/issues/71).

See the above examples for other popular CSS-in-JS solutions (like Styled Components).

A component using `styled-jsx` looks like this:

```jsx
function HelloWorld() {
  return (
    <div>
      Hello world
      <p>scoped!</p>
      <style jsx>{`
        p {
          color: blue;
        }
        div {
          background: red;
        }
        @media (max-width: 600px) {
          div {
            background: blue;
          }
        }
      `}</style>
      <style global jsx>{`
        body {
          background: black;
        }
      `}</style>
    </div>
  )
}

export default HelloWorld
```

Please see the [styled-jsx documentation](https://github.com/zeit/styled-jsx) for more examples.

## Sass, Less, and Stylus Support

To support importing `.scss`, `.less` or `.styl` files you can use the following plugins:

- [@zeit/next-sass](https://github.com/zeit/next-plugins/tree/master/packages/next-sass)
- [@zeit/next-less](https://github.com/zeit/next-plugins/tree/master/packages/next-less)
- [@zeit/next-stylus](https://github.com/zeit/next-plugins/tree/master/packages/next-stylus)
