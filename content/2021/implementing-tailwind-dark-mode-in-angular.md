---
title: 'Implementing dark mode in Angular with Tailwind'
description: 'Because light mode is so 2018.'
pubDate: 'Sep 23 2021'
heroImage: '/images/tailwind-dark-mode/tailwind-dark-mode-meme.jpg'
category: 'angular'
keywords:
    - angular
    - dark mode
---

Admittedly, I'm a dark mode junkie - any app or website I stumble upon, the first thing I look for is the dark mode
switch. Wanting to bring that experience to my own applications, I've recently began dark mode-ing all the things
using [Tailwind](https://tailwindcss.com/docs/dark-mode) to dark mode-ify my Angular and React apps. In an effort to
blog a bit more on my behalf in more bite size chunks, let's take a stab at setting up dark mode in an Angular
application using Tailwind!

## Setting up Tailwind

If you're unfamiliar with Tailwind,
I've [recently written](/<https://joeymckenzie.tech/blog/build-a-tailwind-modal-with-ngrx/)> a bit about what it is and
why I love utilizing it any chance I get in a new project. To get started, let's bootstrap an Angular application and
get into some code. In the [example app](https://github.com/JoeyMckenzie/joey-mckenzie-io-blog-samples) I'll use as a
reference, I'm bootstrapping my project using [Nx](https://nx.dev/) (a blog topic for another day). With our project
scaffolded out, let's go ahead and add Tailwind. Assuming you're using at least Angular v11.2, adding Tailwind to an
existing Angular project is easy as pie:

1. Add Tailwind as a dev package dependency with:

```shell
npm install --save-dev tailwindcss
```

2. With Tailwind installed, let's add the Tailwind styles to our project by referencing Tailwind's custom CSS directives
   that will be swapped out at build time (thanks to native PostCSS support in Angular v11.2+). In our `styles.css`
   file, let's add the following:

#### styles.css

```csharp
@tailwind base;
@tailwind components;
@tailwind utilities;
```

And if you're using SCSS:

#### styles.scss

```csharp
@import 'tailwind/base';
@import 'tailwind/components';
@import 'tailwind/utilities';
```

3. With our styles added, let's add a bare bones `tailwind.config.js` file at the root of our project that will serve to
   help us configure Tailwind in our project:

#### tailwind.config.js

```js
module.exports = {
    darkMode: 'class', // or 'media' or 'class'
};
```

There are a plethora of configuration options that Tailwind offers to further customize how you're using it within a
project (production build optimization, extending themes, adding custom fonts and colors, etc.), but for our purpose, we
only care about telling Tailwind that we'll be using dark mode in our application.

In the above configuration, by telling Tailwind to use the option `darkMode: 'class'`, we're telling the library to
apply dark mode variants when it detects the `dark` class utility in the class list at some node near the root of the
DOM tree (in our case, either the `body` or `html` tag). Our approach to adding a dark mode toggle will then involve
writing the code to dynamically update/remove this `dark` class utility from the class list on the `html` tag as we
click the toggle switch that initiates flipping between dark/light mode.

You can see this in action here on the blog by opening up your browser's developer tools and inspecting the DOM. Looking
at the `html` tag, you'll notice the `dark` class being added, then removed, when you toggle the dark mode switch in the
navbar.

With our Tailwind setup ceremony out of the way, let's start dark mode-ifying our application.

## Adding a dark mode service

To help us facilitate toggling dark mode in our application, let's add an injectable singleton service that will be
responsible for enabling/disabling dark mode styles in our markup. Let's run the service schematic to generate said
service:

```shell
ng g service services/dark-mode
```

With our `dark-mode.service.ts` scaffolded out for us, let's go ahead and add some code to allow us to perform the
necessary DOM updates that Tailwind looks for when determining which style variants to apply:

#### dark-mode.service.ts

```ts
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const DARK_MODE_ENABLED_KEY = 'darkModeEnabled';
const ENABLED_VALUE = 'true';
const NOT_ENABLED_VALUE = 'false';

@Injectable({
    providedIn: 'root',
})
export class DarkModeService implements OnDestroy {
    darkModeEnabled$ = new BehaviorSubject(false);

    constructor() {
        this.setCurrentState();
        this.updateLocalStorageOnStateChange();
    }

    ngOnDestroy(): void {
        this.darkModeEnabled$.complete();
    }

    toggleDarkMode(): void {
        const currentValue = this.darkModeEnabled$.value;
        this.darkModeEnabled$.next(!currentValue);
    }

    private setCurrentState(): void {
        const currentValue = localStorage.getItem(DARK_MODE_ENABLED_KEY);
        const htmlTag = document.getElementsByTagName('html').item(0);
        const classList = htmlTag?.classList;

        if (currentValue === ENABLED_VALUE) {
            this.darkModeEnabled$.next(true);
            classList?.add('dark');
        } else if (currentValue === NOT_ENABLED_VALUE) {
            this.darkModeEnabled$.next(false);
            classList?.remove('dark');
        }
    }

    private updateLocalStorageOnStateChange(): void {
        this.darkModeEnabled$.subscribe((enabled) => {
            const htmlTag = document.getElementsByTagName('html').item(0);
            const classList = htmlTag?.classList;

            if (enabled) {
                localStorage.setItem(DARK_MODE_ENABLED_KEY, 'true');
                classList?.add('dark');
            } else {
                localStorage.setItem(DARK_MODE_ENABLED_KEY, 'false');
                classList?.remove('dark');
            }
        });
    }
}
```

Let's break down the code above so we can get a better understanding of what this service is doing:

1. We expose a `BehaviorSubject` that serves as the source of truth holding the current state value determining if our
   application is in dark mode. We could also hold this information in a more formalized stateful manner using a library
   like [NgRx](https://ngrx.io/), but a simple `BehaviorSubject` does the job for us here. For the purpose of this post,
   we won't be doing anything with this information, but it might be useful if we need to do some dark mode specific
   logic later on.

2. Next, we construct our service by having it call two methods: `setCurrentState`
   and `updateLocalStorageOnStateChange`. Looking at the first method:

#### setCurrentState()

```ts
private setCurrentState(): void {
  const currentValue = localStorage.getItem(DARK_MODE_ENABLED_KEY);
  const htmlTag = document.getElementsByTagName('html').item(0);
  const classList = htmlTag?.classList;

  if (currentValue === ENABLED_VALUE) {
    this.darkModeEnabled$.next(true);
    classList?.add('dark');
  } else if (currentValue === NOT_ENABLED_VALUE) {
    this.darkModeEnabled$.next(false);
    classList?.remove('dark');
  }
}
```

`setCurrentState` is responsible for reading the current dark mode value stored in local storage, either `true`
or `false` identified by the `darkModeEnabled` key. Once it's value is read, we apply the correct class to the `html`
tag depending on what the value is, either adding `dark` to the class list or removing it. We store the dark mode value
in local storage to provide a bit of nice UX for our users so that when they refresh the page, or come back to site
later, their dark mode option they previously selected is persisted.

Again, if you take a look at your browser's current local storage here on the blog, you'll see the `darkModeEnabled`
option with your current selection. Refreshing the page will reapply which option you currently have selected. Neat!

Looking at our second method, `updateLocalStorageOnStateChange`, let's break it down:

#### updateLocalStorageOnStateChange()

```ts
private updateLocalStorageOnStateChange(): void {
  this.darkModeEnabled$.subscribe((enabled) => {
    const htmlTag = document.getElementsByTagName('html').item(0);
    const classList = htmlTag?.classList;

    if (enabled) {
      localStorage.setItem(DARK_MODE_ENABLED_KEY, 'true');
      classList?.add('dark');
    } else {
      localStorage.setItem(DARK_MODE_ENABLED_KEY, 'false');
      classList?.remove('dark');
    }
  });
}
```

`updateLocalStorageOnStateChange()`'s job is to observe and react to changes from our `darkModeEnabled$` subject and
correctly apply the proper class - either adding `dark` or removing it from the class list of the `html` tag.

3. We've registered a listener on our `darkModeEnabled$` subject, so we best do our developer duty by disposing of the
   listener once this service is destroyed in the `ngOnDestroy()` lifecycle hook (it's a singleton, so it'll only be
   called on application destruction):

#### ngOnDestroy()

```ts
ngOnDestroy(): void {
  this.darkModeEnabled$.complete();
}
```

4. Lastly, we add an expose a `toggleDarkMode()` method that, when called, simply flips the dark mode enabled value.

## Using our dark mode service in a component

With the heavy lifting of applying/removing dark mode in our application out of the way, let's go ahead and create a
simple component with just a single Tailwind-styled button. Let's run the following schematic:

```shell
ng g component components/theme-toggle
```

Once our component has been created, let's remove the `theme-toggle.component.css` file as we won't be needing any
custom CSS as Tailwind provides just about everything we need in terms of CSS utilities.

In our `theme-toggle.component.ts`, let's update the component with a bit of code to bring in our dark mode service and
setup a click handler to toggle setting dark mode on our markup:

#### theme-toggle.component.ts

```ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';

@Component({
    selector: 'joey-mckenzie-io-images-samples-theme-toggle',
    templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
    darkModeEnabled$ = this.darkModeService.darkModeEnabled$;

    constructor(private darkModeService: DarkModeService) {}

    toggleDarkMode(): void {
        this.darkModeService.toggleDarkMode();
    }
}
```

Our component code exposes a single method to interact with our dark mode service from the template. With our component
code in place, let's add some simple markup with just a single button that will handle toggling modes:

#### theme-toggle.component.html

```html
<div class="flex min-h-screen flex-col items-center justify-center gap-y-4">
    <button
        (click)="toggleDarkMode()"
        id="dark-mode-toggle"
        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:hover:bg-blue-900"
    >
        Toggle
    </button>
    <p class="text-black dark:text-white">
        Dark mode enabled: {{ (darkModeEnabled$ | async) === true }}
    </p>
</div>
```

With the markup above, all we should see now when we run our application is a single button in the middle of the page (
make sure you add our component selector to `app.component.html`).

In our class list, you'll notice a few classes prefixed with `dark:`. This is how we tell Tailwind to apply the dark
mode class variant when it detects `dark` in the class list higher up the DOM chain. We can also apply dark mode
variants to pseudo-selectors as well as we see with the dark mode variant on our `hover:` selector. Pretty cool!

One last change we'll make is in our `index.html` root markup file to apply background colors as we toggle modes:

#### index.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>TailwindDarkMode</title>
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
    </head>

    <body class="bg-white dark:bg-black">
        <joey-mckenzie-io-blog-samples-root></joey-mckenzie-io-blog-samples-root>
    </body>
</html>
```

In our `body` tag, we add some background colors corresponding to which mode we're currently in. With everything
strapped together, if we fire up our application and navigate to `localhost:4200`, we'll be able to see our masterpiece
in action:

[Tailwind dark mode toggle example](/images/tailwind-dark-mode/dark-mode-toggle.webm)

With dev tools open, you'll see the class list on the `html` tag update each time we click the button, as well as seeing
the value updated in local storage. If we refresh the page as well, we'll keep our dark mode in tact if we have that
option selected before reloading!

As always, take a look at
the [example code](https://github.com/JoeyMckenzie/joey-mckenzie-io-blog-samples/tree/main/apps/tailwind-dark-mode) for
reference and let me know if you have any suggestions for a different implementation.

Happy dark mode-ing, friends!
