# Drive:Focus

## Are smart devices smart enough?
Hackzurich project for T-Systems & Zurich Insurance

Smart devices have greatly reshaped our way of living, including mobility. Although they are bringing much convenience and benefits, the associated risks are also increasing: people are driving, walking, cycling, skiing, riding, etc. while being distracted by their smart devices. <br />

Numerous facts support this statement, such as:

Fact 1: 43% of young people have walked into something or someone while checking their phone. In fact, countries are creating “smartphone” walking lanes goo.gl/N0Xt2H<br />

Fact 2: 6 out of 10 car crashes involve distraction, out of which 12% are due to the use of mobile phones goo.gl/jVmPpT<br />

## Drive:Focus
This project intends to promote safe behaviours and new ideas to embed road-smartness into the future way of mobility.


## What is used?
* Microsoft Cognitive Services is used. MVP uses entity/item tagging to detect possible elements of the photo which may be assosiated with distraction / tiredness. i.e cellphone.

### Proposed improvements
***Custom Computer Vision***
Microsoft Azure offers the Custom Computer Vision service, which can be train with a set of photos of drives which may be sleepy / tired.

***Similar face search***
We collect photos of people looking at the phone and use the Similar Face Search service to detect it.

***Eye-Nose Distance***
If the head is directed towards down, it might be an indication for a driver sleeping or looking down at the phone, even if the phone may not be visible at a time.
The distance between eyes and the nose, when projected onto a 2D-plane, is shorter in this case.

## Where to start?
***/client**
Ionic app

***/server**
NodeJS Server

***/live-demo**
Live demo for the presentation

***/presentations**
Presentations, pitch decks etc.

## TODO's
1. Deploy the server to T-Systems Cloud
2. Integrate API in the Ionic App
3. Integrate API in the Live-presentation
4. Work on design

## HackZurich 2017 Team
Adrian Barwicki (adrian@vq-labs.com)<br />
Ingmar Wolff (@TODO)<br />
Marcel Engelmann (mail@menux.de)<br />
Lukas Maxeiner (@TODO)

## Licence
MIT
