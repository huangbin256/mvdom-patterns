
## Concept

Some simple but scalable DOM and Javascript Centric patterns to build scalable application.

- Simple scale better. 
- Patterns outlast frameworks.
- Embrace the DOM, don't fight it. 
- Mega frameworks hardcode patterns, micro frameworks enable them. 
- Frameworks comes and go, runtimes last.

Used right, the DOM does not need much to become a strong foundation for scalable application model. Here are some of those patterns using the mvDom DOM Centric micro-framework (< 12kb).

## Install & Run

Requirement: node.js >6.x, gulp

```
git clone git@github.com:mvdom/mvdom-patterns.git

cd mvdom-patterns
npm install
gulp
npm start
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
