# IpHunter

![ipHunterLogo](https://user-images.githubusercontent.com/25290565/205732782-844433e7-f13e-4d20-8a06-4a915ae3ba03.svg)

## Inspiration

**NextJs** is the fastest frontend framework of our time.

**Vectors** are lighter, load faster and can be beautifully animated.

**Docker** makes projects composable and reproducible.

When searching StackOverflow and Medium, one finds little and incomplete instructions on how to make those 3 work together.
With this case study, we explore the optimal project setup for this powerful trio 🧜🏽‍♂️

Using devPost as source for bleeding edge tech:
- **GoogleMaps** new Vector maps compatible with GPU accelerated DeckGL and D3 vector animations.
- **SlimAi** for optimizing security and size of the projects own docker and the peripheral SOC containers (ELK stack).

## Case Study

Security Operation Center (SOC) analyst are really good at detecting, isolating and clearing threats in our networks, but they are not developers.

Depending on the SOC you can still find them filling in excel sheets per hand and emailing Indicators of Compromise (IOC).

Our case study is defined as a project meant to support SOCs through better insight into data and accelerated workflow through automation.

[Live Demo](https://iphuntermap.vercel.app/map#)

[Hardened Docker Image](https://hub.docker.com/layers/3llobo/iphuntermap/latest-slim/images/sha256-70221642727147f5c3239dbc8f62fd97e0483bcaf6778ebcf24579b9b28a2d11?context=repo)

## What IpHunter does so far

IpHunter collects IP-based geo intel from established CTI-sources and visualizes the data in a compact view which let's the analyst take faster action.

IpHunter acts as an extension to [`theHiveProject`](http://thehive-project.org/).

The main features are:
 - **Interactive map with heatmap and scatterplot based on the IP's geodata.**
 - **Full SOC in optimized docker-compose for production deployment.**


## How we built it

For the SOC:
 - **Dockerfile** for NextJs app.
 - **Docker-compose** combining our app with the ELK stack SOC.
 - **SlimAi** reduced container vulnerabilities by 90%
 - **SlimAi** reduced container size by 50% (even for the popular Elasticsearch container)


For the Map:
 - **GoogleMaps** vector map with custom map style to match the dark and light mode.
 - **DeckGL Scatterplot** to plot the GeoData.
 - **DeckGL DataFilterExtension** for cool GPU accelerated animations.
 - **D3** for vector animation.
 

The Tecq stacq:
 - NextJs and tailwind for the frontend
 - D3 for animations
 - docker for containerization
 - slim cli for docker optimization

## SlimAi Security assessment


NextJs has a security-first mentality, thus it is unsurprising that the app-container has little security vulnerabilities. Where SlimAi makes a huge impact is in the image size. SlimAi reduced the size from 1.5GB to 150MB achievening optimization of **90%**  !!!

![hunterSlim](https://user-images.githubusercontent.com/25290565/205758908-416e0c01-ecf1-430a-abf8-27638c1841c3.png)

In php based opensource images from `theHiveProjects` the size reduction veried between 50 and 20%.
Specifically for Cortex, SlimAI impressed by reducing vulnerabilities from ~500 to 25, resulting in an **95%** more secure image! Simply stunning 💥

![cortexShortSlim](https://user-images.githubusercontent.com/25290565/205760416-5bbebbf4-6fc7-48cd-8283-b486e7675cf5.png)


## What we learned

SlimAi does magic on any container, especially on the homebrew but also on established official containers. 
It finds and reduces security vulnerabilities in every container I tested so far 🚀🚀🚀



I am still stunned by the cool data visualizations we can build on top of GoogleMaps.
Did not expect GoogleMaps to be to versatile and customizable.
Love it 🤗💝

## What's next for IpHunter

IpHunter will join the long list of half-maintained open-source projects.
Feel welcome to contribute or adjust and use it for your own SOC.

Happy hunting 🏹


![image](https://user-images.githubusercontent.com/25290565/202432467-bcaac4b5-69e1-4401-93ff-164eae87a7d6.png)
