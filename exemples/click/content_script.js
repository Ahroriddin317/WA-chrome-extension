function clickPlanet() {
    var planets = document.getElementsByClassName("planet-name"),
        randomplanet = Math.floor(Math.random() * planets.length),
        clickplanet = planets[randomplanet];

    clickplanet.click();
}

clickPlanet();