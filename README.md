
## Concept

Some simple but scalable DOM and Javascript Centric patterns to build scalable application.

- Simple scale better. 
- Patterns outlast frameworks.
- Embrace the DOM, don't fight it. 
- Mega frameworks hardcode patterns, micro frameworks enable them. 
- Frameworks comes and go, runtimes last.

Used right, the DOM does not need much to become a strong foundation for scalable application model. Here are some of those patterns using the mvDom DOM Centric micro-framework (< 12kb).

## Install & Run (gulp-free)

Note: We spent to some times to make this project gulp-free for simplicity sake. While gulp seems to reduce line of codes for build scripts, it also adds another layer of abstraction which is hard to follow sometime. Going back to the basics (pure node.js) really add clarity and future customization. (checkout the ./scripts/build.js to see the raw build). This is our preferred way from now on. 

Requirement: node.js >6.x

```
git clone git@github.com:mvdom/mvdom-patterns.git

cd mvdom-patterns
npm install
npm run build
npm start
```

for live dev (in another terminal, same folder)
```
npm run build watch
```


## Install & Run (with gulp)

Requirement: node.js >6.x, gulp

```
git clone git@github.com:mvdom/mvdom-patterns.git

cd mvdom-patterns
npm install
gulp
npm start
```

for live dev (in another terminal, same folder)
```
gulp watch
```



## What's in

- Code structure (simple but scalable). 
    - web/ is the output dir.
    - src/ are the source files to be compiled into web/ folder.
    - src/view structure view components.
    - Three output files app-bundle.js (app code), lib-bundle.js (3rd party lib), all-bundle.css.
- build system
    - gulp / browserify / handlebar compiler / source map.
- App Patterns
    -  Simple but scalable (i.e. distributed) routing system & navigation.
    -  CSS Flexbox app layout.
    -  Simpler "scheduler.js" system to schedule task on a view level or manually. 

## What's next

- Add TodoMVC module (first with a client in memory management).
- Continue dashboard (table content).
- More CSS Flexbox patterns.
    - Form / fields patterns.
    - Continue table layout with flexbox (scrolling, resizing, ...).
- DataService layer (ds.js) with matching mock-server API (for TodoMVC).
