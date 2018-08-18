# Introduction

This project is about displaying the baton - long staff fencing - sequences of an old manual (Giuseppe Cerri's 
Trattato teorico-pratico della scherma di bastone. Col modo di difendersi contro varie altre armi sia di punta che di taglio.) 
for research and study study purposes. 


# Installation

The following chapter describes the installation process of NPM and bower. This steps 
needs to be done only once.

## 1. Install node js for NPM package manager 

Download and install nodejs from [nodejs.org](https://nodejs.org)

## 2. Install bower and polymer-cli

```cmd
    npm install -g bower
    npm install -g polymer-cli
```

## 3. Download dependencies

```cmd
cd app
npm install
```

This command will download the necessary dependencies

## 4. Start application

```cmd
cd app
node index.js
```

This will display the exercises..

## 5. Performance and result

  * The naive algorithm calculated cca. 100 drills. 
  * The advanced algorithm calculated around 39 drills for maximum 6 moves / drill, and required around 6 seconds.
  * By increasing the maximum moves to 8, the algorithm found 28 drills covering the whole graph, and required around 8 minutes. 

