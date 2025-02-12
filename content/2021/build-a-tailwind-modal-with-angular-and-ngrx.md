---
title: 'Build a Tailwind modal with Angular and NgRx'
description: "Out-of-the-box modals are nice, but often times inflexible and can bring a lot of unnecessary code into a project for something as simple as displaying a message. Let's use Tailwind to build our very own state-based modal instead!"
pubDate: 'Apr 27 2021'
heroImage: '/images/tailwind-ngrx-modal/off_the_shelf_modal.jpg'
category: 'angular'
keywords:
    - angular
    - ngrx
    - typescript
---

Coming off a blogging hiatus, I'm finally making my triumphant return. If you've been following my writing up until now,
you'll know that I'm primarily a .NET dude. Lately, I've been wanting to get back to my roots with Angular and see what
I could build with everyone's new favorite CSS framework on the block, [Tailwind](https://tailwindcss.com/). I'm going
to be dialing back the length in content in place of smaller, bit-sized chunks in an effort to get back to helping the
general developer population with the lessons I've learned and things that I think are fire (as the kids say) in the
community. With that out of the way, let's dive in!

## What is Tailwind?

If you're not familiar with Tailwind CSS, it's a utility-based CSS framework that I like to think of as an API into your
CSS. This isn't exactly an article about the intricacies and deep diving into the framework, as there are plenty of
great developers out there writing about Tailwind and why we all think it's the future of stylized development (
seriously, once you start using, you'll most likely never want to go back). Tailwind is awesome due to it's flexibility
and thin footprint (given you process your build correctly) it provides to our applications. With Tailwind, you'll
_rarely_ find yourself writing custom CSS and if you have a need for such, you can always include it as
a [separate utility](https://tailwindcss.com/docs/adding-new-utilities) for reusability purposes.

Bottom line, Tailwind is amazing and an excellent tool to add to any developer's tool belt.

> Disclaimer: I pay for [Tailwind UI](https://tailwindui.com/) because I love the components that Adam Wathan and the
> Tailwind team have put together. I would recommend anyone that loves Tailwind to check it out, but for the purposes of
> our demo here, we'll only be using the publicly available free components.

## Modal components

Often times (read: every other sprint), it's helpful to add a bit of pizazz to our frontend application messaging in the
form of modals that display handy bits of information for our users. While we _could_ use an out-of-the-box modal
component using a styling library like [Angular Material](https://material.angular.io/)
or [Bootstrap](https://getbootstrap.com/), luckily for us, Tailwind UI offers a set
of [awesomely styled modal components](https://tailwindui.com/components/application-ui/overlays/modals) ready for use.
We'll be using the free modal component here to quickly prototype our app modal that we could potentially use throughout
our site.

## What we'll build

Getting started, let's run through the list of what we'll be building and the tools we'll utilize as we embark on our
modal-based journey:

-   We'll utilize Tailwind as our style provider to give our modal a modern look and feel
-   Instead of using an injectable service to dynamically render DOM that contains our modal markup and content using
    something like Angular's [Renderer2](https://angular.io/api/core/Renderer2), we'll lean on a flux-based state approach
    using [NgRx](https://ngrx.io) to help us manage the displaying of our modal with custom content (more on this in a
    minute)
-   Using a state-based approach, we'll expose actions that will allow any of our components to call into the modal and
    display it based on any set of criteria

With our approach lined out, let's defer to the second bullet point of the aforementioned list.

## Using state in place of rendering

While it might be tempting to take on a dependency to render modal's within our application, that approach can bring
along quite a bit of unnecessary JavaScript and CSS that is most likely over engineered for our simple use cases.
Another popular approach is to write our own custom rendering services that inject DOM directly into the rendered
markup; this is a popular homegrown solution with many articles and example repositories available to pull from. I find
often times that these solutions can be a bit cumbersome with quite a few moving pieces to keep track and once again,
quite frankly, feel a bit over engineered. While I'm quite positive someone much smarter than myself has an excellent
counterpoint to this, I fall in the camp of _shove all your application logic into flux actions_ and it only seemed
natural to have my components like modals, slide overs, dropdowns, menus, etc. fit into that bill as well.

With our sermon out of the way, let's get into some code. At any point, you can always refer to
the [source code](https://github.com/JoeyMckenzie/joey-mckenzie-io-blog-samples/tree/main/projects/ngrx-tailwind-modal)
on my GitHub for reference.

## Getting started

While I'm using an Angular workspace in the example project, this all applies to existing single project workspaces as
well. Let's spin up a new application using your terminal of choice:

```shell
ng new ngrx-tailwind-modal
```

> I'm using Angular version 11.2.5, which fortunately for us, the Angular team has included PostCSS into the build
> processor allowing us to natively install Tailwind without explicitly installing it's dependencies

With our project in place, let's go ahead and install Tailwind (assuming you're using Angular v11.2 or greater):

```shell
npm install --save-dev tailwindcss
```

and if you're using yarn:

```shell
yarn add tailwindcss
```

I'm using CSS in the example below, so we need to add the Tailwind utilities to our global styles as well:

#### styles.css

```csharp
@tailwind base;
@tailwind components;
@tailwind utilities;
```

If you're using another CSS library, checkout the [docs](https://tailwindcss.com/docs/installation) to get started. I've
opted to use just good ole fashioned CSS here since I won't be writing any custom styles myself and have no need to
process CSS files during build time.

With Tailwind in place, let's go ahead and add NgRx to our dependencies:

```shell
npm install @ngrx/store --save
```

and for yarn

```shell
yarn add @ngrx/store
```

Optionally, you can install NgRx dev tools as well to assist with debugging, but for our simple use case, it's not
necessary. With our required dependencies in place, let's go ahead and generate a new modal component. Go ahead and `cd`
into your project directory and run the Angular schematic to spin up a new component:

```shell
ng g c modal --skip-tests
```

We'll add the `--skip-tests` flag for now as we won't be unit testing our modal. After our schematic has run, go ahead
and open up `modal.component.html` and let's replace the markup with Tailwind's free modal component HTML:

### modal.component.html

```html
<!-- This example requires Tailwind CSS v2.0+ -->
<div
    class="fixed inset-0 z-10 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
>
    <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
    >
        <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
        <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
        ></div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
            class="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
            >&#8203;</span
        >

        <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
        <div
            class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div
                        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                    >
                        <!-- Heroicon name: outline/exclamation -->
                        <svg
                            class="h-6 w-6 text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3
                            class="text-lg font-medium leading-6 text-gray-900"
                            id="modal-title"
                        >
                            Deactivate account
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Are you sure you want to deactivate your
                                account? All of your data will be permanently
                                removed. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
            >
                <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    Deactivate
                </button>
                <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
```

While I've just copy pasta'd over the direct HTML component, using Tailwind it's straight forward to replace markup
verbiage, button text, and custom brand styles easily into our components using a few simple `@Input()` props on
our `modal.component.ts` class in combination with some `[ngClass]` directives sprinkled throughout our HTML. I'll leave
that extensibility feat as an exercise for the reader.

With our modal markup in place and our component brought in to our `app.module.ts`'s `declarations` array, let's go
ahead add write our NgRx actions, reducer, and a few helpers to help facilitate opening and closing the modal. First,
let's add a directory just beneath `/app` named `+state`. `+state` is a common directory name for a module's state
actions, reducers, effects, selectors, and other NgRx semantics that helps provide a bit of convention when
encapsulating modular state.

With our directory in place, let's get started by adding a `layout.actions.ts` file to house our dispatchable actions to
the store with the following code:

#### layout.actions.ts

```typescript
import { createAction } from '@ngrx/store';

export const openModal = createAction('[Layout] Open modal');

export const closeModal = createAction('[Layout] Close modal');
```

We don't include any `props` in our actions, but we could easily define a single action with a flag signaling the
modal's state - I fall in the camp of "it's not that hard to write actions, just boilerplate-y" so I prefer more, atomic
actions rather than generic, composable actions. With our actions in place, let's go ahead and define our layout state
inside a new file named `layout.reducer.ts`:

#### layout.reducer.ts

```typescript
import { Action, createReducer, on } from '@ngrx/store';
import * as fromActions from './layout.actions';

export const layoutFeatureKey = 'layout';

export interface LayoutState {
    modalIsOpen: boolean;
}

const initialState: LayoutState = {
    modalIsOpen: false,
};

const appReducer = createReducer(
    initialState,
    on(fromActions.openModal, (state) => ({
        ...state,
        modalIsOpen: true,
    })),
    on(fromActions.closeModal, (state) => ({
        ...state,
        modalIsOpen: false,
    })),
);

export const reducer = (state: LayoutState | undefined, action: Action) =>
    appReducer(state, action);
```

Again, this post _is not_ meant to the de facto grimoire of implementing NgRx properly in your application. Given our
scope, we'll use just a simple state implementation to facilitate our layout state that could easily be extended to
include any number of layout specific concerns.

Breaking down the code above, we:

-   Define our layout feature slice with `LayoutState` that will serve as the source of truth for our current modal
    displaying
-   Create a reducer to facilitate _what_ our state should look like when the modal actions are dispatched
-   Create an identifying `const` key to declare our layout feature slice with `layoutFeatureKey`

While we could easily set singular state on each reducer type to simply set the modal state according, as our
application grows, so will our need to only change single, or a handful at most, pieces of state at time. For these
cases, we'll go ahead and add in a `...state` to shallow copy our current state as to not mutate any state that is not
concerned with the modal state.

With our reducer in place, let's go ahead and add a selector to get the current modal state and provide multiple
components a single funnel into our state. Let's create a `layout.selectors.ts` file in our `+state` folder with the
following:

#### layout.selectors.ts

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState, layoutFeatureKey } from './layout.reducer';

const layoutFeatureSlice = createFeatureSelector<LayoutState>(layoutFeatureKey);

export const selectModalStatus = createSelector(
    layoutFeatureSlice,
    (state: LayoutState) => state.modalIsOpen,
);
```

Within our selector, we define a feature selector to reference the `layout` slice of our composite state, and then
create a selector to grab the modal state node. With our selector in place let's go ahead and create a facilitator to
help shroud our store inner workings from our components so that we can create a layer of abstraction between the
technical details of our application and the view layer that users ultimate see.

> This is known as the [_facade pattern_](https://en.wikipedia.org/wiki/Facade_pattern) in software development, and
> while it is worth keeping in the back of your mind, it's a bit outside our scope for now. Checkout my (shameless plug)
> post on [state management with Blazor](https://joeymckenzie.tech/blog/fluxor-blazor-part-1) for a more in-depth
> discussion.

Adding a state facade is entirely optional, and should not be taken as final truth - there are many reason to _not_
include this service as it does trade some complexity and boilerplate-ness for a bit of dependency inversion. You're
more than welcome to facilitate your actions directly from your components as well.

With the disclaimer out of the way, let's add a `layout.facade.ts` with the following:

#### layout.facade.ts

```typescript
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { LayoutState } from './layout.reducer';
import * as fromActions from './layout.actions';
import * as fromSelectors from './layout.selectors';

@Injectable()
export class LayoutFacade {
    modalState$ = this.store.pipe(select(fromSelectors.selectModalStatus));

    constructor(private store: Store<LayoutState>) {}

    openModal() {
        this.store.dispatch(fromActions.openModal());
    }

    closeModal() {
        this.store.dispatch(fromActions.closeModal());
        setTimeout(() => this.openModal(), 1000);
    }
}
```

Our `layout.facade.ts`, as we can see, is nothing more than a scoped service (we don't include the `providedIn`
configuration to `@Injectable()`) that pulls through our selectors and defines some methods wrapping our dispatcher that
fires off the modal actions. Our `closeModal()` method also includes the following:

```typescript
setTimeout(() => this.openModal(), 1000);
```

This is solely for example purposes as to mimic the behavior of the Tailwind UI modal examples (closing a modal on the
example reopens the modal shortly after). This will save us some interaction with a button when testing out our modal.

With our state ceremony out of the way, let's go ahead and wire up everything we need in our `app.module.ts`

#### app.module.ts

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LayoutFacade } from './+state';
import { layoutFeatureKey, reducer } from './+state/layout.reducer';

import { AppComponent } from './app.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
    declarations: [AppComponent, ModalComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({ [layoutFeatureKey]: reducer }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
        }),
    ],
    providers: [LayoutFacade],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

We include the required NgRx modules using our `layoutFeatureKey` defined in our reducer file, include our Redux
DevTools plugins and `LayoutFacade` service, and also include the `BrowserAnimationsModule` we'll use to add some nice
transitions to our modal for flare.

Speaking of transitions, let's go ahead and add a few animations in our `modal.component.ts` to add the pleasing
appearing/fading of the modal onto page. In our `modal.component.ts`, we'll add three simple animation attribute:

-   `@modalContainer`
-   `@modalOverlay`
-   `@modalContent`

Let's add each of the tags to our markup so that it resembles the following:

```html
<!-- This example requires Tailwind CSS v2.0+ -->
<div
    @modalContainer
    *ngIf="(modalState$ | async) === true"
    class="fixed inset-0 z-10 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
>
    <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
    >
        <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
        <div
            @modalOverlay
            (click)="onClose()"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
        ></div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
            class="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
            >&#8203;</span
        >

        <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
        <div
            @modalContent
            class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div
                        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                    >
                        <!-- Heroicon name: outline/exclamation -->
                        <svg
                            class="h-6 w-6 text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3
                            class="text-lg font-medium leading-6 text-gray-900"
                            id="modal-title"
                        >
                            Deactivate account
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Are you sure you want to deactivate your
                                account? All of your data will be permanently
                                removed. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
            >
                <button
                    (click)="onClose()"
                    type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    Deactivate
                </button>
                <button
                    (click)="onClose()"
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
```

We'll use each of the animation attributes to drive the transition animations
using [parent-child animations](https://angular.io/guide/transition-and-triggers#parent-child-animations).

> There's lots of great posts that are much more in-depth about Angular's transition library, and I'll once again defer
> that as an exercise for the reader.

With our component markup in place, let's add the inner workings of our `modal.component.ts`:

#### modal.component.ts

```typescript
import {
    trigger,
    transition,
    query,
    animateChild,
    state,
    style,
    animate,
    group,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { LayoutFacade } from '../+state';

@Component({
    selector: 'femfit-modal',
    templateUrl: './modal.component.html',
    animations: [
        trigger('modalContainer', [
            transition(':enter', [
                group([
                    query('@modalOverlay', animateChild()),
                    query('@modalContent', animateChild()),
                ]),
            ]),
            transition(
                ':leave',
                group([
                    query('@modalOverlay', animateChild()),
                    query('@modalContent', animateChild()),
                ]),
            ),
        ]),
        // Background overlay, show/hide based on modal state.

        // Entering: "ease-out duration-300"
        //   From: "opacity-0"
        //   To: "opacity-100"
        // Leaving: "ease-in duration-200"
        //   From: "opacity-100"
        //   To: "opacity-0"
        trigger('modalOverlay', [
            state(
                'void',
                style({
                    opacity: 0,
                }),
            ),
            state(
                '*',
                style({
                    opacity: 1,
                }),
            ),
            transition(':enter', [animate('300ms ease-out')]),
            transition(':leave', [animate('100ms ease-in')]),
        ]),
        // Modal panel, show/hide based on modal state.

        // Entering: "ease-out duration-300"
        //   From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        //   To: "opacity-100 translate-y-0 sm:scale-100"
        // Leaving: "ease-in duration-200"
        //   From: "opacity-100 translate-y-0 sm:scale-100"
        //   To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        trigger('modalContent', [
            state(
                'void',
                style({
                    opacity: 0,
                    transform: 'scale(0.95)',
                }),
            ),
            state(
                '*',
                style({
                    opacity: 1,
                    transform: 'scale(1)',
                }),
            ),
            transition(':enter', [animate('300ms ease-out')]),
            transition(':leave', [animate('200ms ease-in')]),
        ]),
    ],
})
export class ModalComponent implements OnInit {
    modalState$ = this.layoutFacade.modalState$;

    constructor(private layoutFacade: LayoutFacade) {}

    private readonly unsubscribe$ = new Subject();

    ngOnInit(): void {
        // When the component is mounted, fire up the modal if closed taking the first emission only
        this.modalState$.pipe(take(1)).subscribe((isOpen) => {
            if (!isOpen) {
                this.layoutFacade.openModal();
            }
        });

        // Register a stream to listen for escape keydown events to close the modal
        fromEvent(document, 'keydown')
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(
                    (event) =>
                        event instanceof KeyboardEvent &&
                        event.code === 'Escape',
                ),
                withLatestFrom(this.modalState$),
            )
            .subscribe(([_, modalIsOpen]) => {
                if (modalIsOpen) {
                    this.layoutFacade.closeModal();
                }
            });
    }

    onClose(): void {
        this.layoutFacade.closeModal();
    }
}
```

Let's breakdown what our modal component is doing behind the scenes:

-   First, we define three animation `trigger`s that will run when our component is rendered into and out of the DOM (I've
    loosely translated the suggested Tailwind transition classes that should apply to the modal)
    -   Our first `trigger` is applied to the wrapping `div` element that houses the entirety of our modal component, and
        it's job is to coordinate running the nested child transitions when it is rendered into/out of the DOM (driven by
        the `*ngIf="(modalState$ | async) === true"` directive) with the assistance of the `group` and `query` Angular
        animation helper methods to signify which child transitions to run
    -   Our second `trigger` is the fading in and out of the background overlay using a simple opacity transition
    -   Our third `trigger` is the displaying of the modal content using a combination of opacity and scaling transition
        animations
    -   You'll notice each `trigger` transitions using the `:enter`/`:leave` aliases which represent the transitioning
        of `void` state (i.e. not in the rendered DOM), to `*` state (i.e. any state existing in the markup)
-   Next, we pull through a reference from the state facade to the current modal status with `modalStatus$` observable
    that listens for values based on our selector stream
-   We define an emission `Subject` to help facilitate the closing of our streams when our component is destroyed, i.e.
    removed from the DOM, in order to avoid memory leaks that can be pretty common in `rxjs` without proper `Observable`
    management
-   Finally, inside of our mounting lifecycle hook:
    -   We listen on modal state changes and fire off the action to open the modal anytime on first render using `take(1)`
    -   We hook into the hot document observable and listen for `esc` keydown strokes to provide a bit of nice UX to close
        the modal anytime it's open and the key is pressed

With all of our modal details in place, let's finally add the component to our `app.component.html` by replacing all the
placeholder markup with the modal selector:

```html
<app-modal></app-modal>
```

With everything wired up, let's go ahead and punch in a `ng serve` in the terminal of your choice and navigate
to `localhost:4200`. Clicking on either of the buttons now closes the modal, and if we take a look at our Redux DevTools
in the console, we can see the actions being dispatched:

[Our full Ngrx-based Tailwind modal](/images/tailwind-ngrx-modal/screen_grab.webm)

You'll see in the above screencast I interact with the modal in a few ways:

1. Closing the modal via clicking either button
2. Closing the modal by clicking on the background overlay, thanks to the `(click)` handler we added to the
   overlay `div` that dispatches the close action
3. Closing the modal by hitting the `esc` key

While I've begun to shift to state-based layout UI/UX, there _are_ some limitations (with workarounds, of course) to
using state for things like modals, sliding navs, toast notifications, etc. One of the major benefits, in the case of
the modal, to using a DOM injection service is the ability to render dynamic content in your modal. This allows for us
to pass any rendering component to the modal service, often times, and have it display in the content area. While we
_could_ achieve this with a state-based approach, it's a bit more work that I have yet to find a solution I'm satisfied
with.

In the end, I love Tailwind and the sanity (at the cost of complexity) that NgRx brings to my Angular applications and
will continue to move forward offloading common UI interactions into layout state slices.

Until next time, friends!
