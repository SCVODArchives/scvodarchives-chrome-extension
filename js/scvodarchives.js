let titleEl = document.querySelector(".title");
let liquipediaEl = document.querySelector(".liquipedia");
let nextEl = document.querySelector(".next");
let expansionEl = document.querySelector(".expansion");
let downloadEl = document.querySelector(".download");
let playerEl = document.querySelectorAll(".player");
let loadingEl = document.querySelector(".loading");
let historyEl = document.querySelector(".history.spoiler");
let thumbnailEl = document.querySelector(".stream-thumbnail");

let updatePanel = (data) => {
    if (data.error){
        loadingEl.classList.remove("hide-top");
        loadingEl.textContent = `ERROR: ${data.error}`;
        return;
    }
    if (data.stream.type === "live"){
        loadingEl.classList.add("hide-top");
        createEl("a", "", { "href": "https://twitch.tv/scvodarchives", "rel": "noopener noreferrer", "target": "_blank" }, [], document.querySelectorAll(".stream-thumbnail")[0]);
        createEl("img", "", { "title": data.stream.title, "src": data.stream.thumbnail.replace(/{width}/, "250").replace(/{height}/, "141") }, ["thumbnail"], document.querySelectorAll(".stream-thumbnail > a")[0]);
        createEl("span", "🔴", null, ["stream-thumbnail-live"], document.querySelectorAll(".stream-thumbnail")[0], true);
        titleEl.innerHTML = `<span class="item-title">Playing</span>: ${data.title}`;
        liquipediaEl.innerHTML =`<span class="item-title">Liquipedia</span>: <a href="${data.liquipedia}" rel="noopener noreferrer" target="_blank"> <img src="https://starcraftvods.com/images/liquipedia.png" class="icon" /></a>`;
        nextEl.innerHTML = `<span class="item-title">Next Match</span>: ${data.next}`;
        expansionEl.innerHTML = `<span class="item-title">Expansion</span> ${data.expansion.fullName}`;
        downloadEl.innerHTML = data.download !== false ? `<span class="item-title">Download Tournament</span>: <a href="https://starcraftvods.com/dl/?${data.download.short_code}" rel="noopener noreferrer" target="_blank">Magnet Link</a> (${data.download.size})` : null;

        if (Boolean(data.gstl)){
            playerEl[0].innerHTML = "GSTL VODs don't have player data.";
            document.querySelector(".item.history").remove();
            return;
        }

        let i = 0;
        for (var d in data.aligulac) {
            if (data.aligulac.hasOwnProperty(d)) {
                if (d === "history") continue;
                if (data.aligulac[d].hasOwnProperty("error")){
                    createEl("div", data.aligulac[d].error, null, ["player-ign"], playerEl[i]);
                    continue;
                }
                createEl("div", data.aligulac[d].tag, null, ["player-ign"], playerEl[i]);
                createEl("img", "",  { "src": `https://starcraftvods.com/images/flags/${data.aligulac[d].country}.png`, "title": data.aligulac[d].country}, ["icon"], document.querySelectorAll(".player-ign")[i]);
                createEl("img", "",  { "src": `https://starcraftvods.com/images/${data.aligulac[d].race}.png`, "title": (data.aligulac[d].race === "Z" ? "Zerg" : (data.aligulac[d].race === "T" ? "Terran" : (data.aligulac[d].race === "P" ? "Protoss" : ""))) }, ["icon"], document.querySelectorAll(".player-ign")[i]);
                createEl("div", data.aligulac[d].name, null, ["player-name"], playerEl[i]);
                createEl("span", "Name: ", null, ["player-title"], document.querySelectorAll(".player-name")[i], true);
                data.aligulac[d].romanized_name ? createEl("div", data.aligulac[d].romanized_name, "", ["player-romanized"], playerEl[i]) : null;
                createEl("span", "Romanized: ", null, ["player-title"], document.querySelectorAll(".player-romanized")[i], true);
                createEl("div", data.aligulac[d].birthday !== null ? data.aligulac[d].birthday : "Unknown", null, ["player-birthday"], playerEl[i]);
                createEl("span", "Birthday: ", null, ["player-title"], document.querySelectorAll(".player-birthday")[i], true);
                createEl("div", `$${data.aligulac[d].total_earnings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, null, ["player-earnings"], playerEl[i]);
                createEl("span", "Earnings: ", null, ["player-title"], document.querySelectorAll(".player-earnings")[i], true);
                createEl("div", "", null, ["player-liquipedia"], playerEl[i]);
                createEl("a", "Liquipedia", { "href": `https://liquipedia.net/starcraft2/${data.aligulac[d].lp_name ? data.aligulac[d].lp_name : data.aligulac[d].tag}`, "rel": "noopener noreferrer", "target": "_blank" }, [], document.querySelectorAll(".player-liquipedia")[i], true);
                createEl("div", "", null, ["player-aligulac"], playerEl[i]);
                createEl("a", "Aligulac", { "href": `http://aligulac.com/players/${data.aligulac[d].id}`, "rel": "noopener noreferrer", "target": "_blank" }, [], document.querySelectorAll(".player-aligulac")[i], true);
                i++;
            }
        }

        if (data.aligulac.history.hasOwnProperty("error")){
            history = "NO MATCH HISTORY FOUND OR BAD DATA.";
        }else{
            for(let i = 0; i <= 4; i++){
                if (data.aligulac.history.objects[i]){
                    createEl("span", `${data.aligulac.history.objects[i].eventobj.fullname} (${data.aligulac.history.objects[i].date})`, null, [], historyEl);
                    createEl("br", "", null, [], historyEl);
                    let p = document.createTextNode(data.aligulac.history.objects[i].pla.tag);
                    historyEl.appendChild(p);
                    createEl("img", "", { "src": `https://starcraftvods.com/images/${data.aligulac.history.objects[i].rca}.png`, "title": (data.aligulac.history.objects[i].rca === "Z" ? "Zerg" : (data.aligulac.history.objects[i].rca === "T" ? "Terran" : (data.aligulac.history.objects[i].rca === "P" ? "Protoss" : ""))) }, ["icon"], historyEl);
                    let t = document.createTextNode(`${data.aligulac.history.objects[i].sca}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${data.aligulac.history.objects[i].scb}`);
                    historyEl.appendChild(t);
                    createEl("img", "", { "src": `https://starcraftvods.com/images/${data.aligulac.history.objects[i].rcb}.png`, "title": (data.aligulac.history.objects[i].rcb === "Z" ? "Zerg" : (data.aligulac.history.objects[i].rcb === "T" ? "Terran" : (data.aligulac.history.objects[i].rcb === "P" ? "Protoss" : ""))) }, ["icon"], historyEl);
                    p = document.createTextNode(data.aligulac.history.objects[i].plb.tag);
                    historyEl.appendChild(p);
                    createEl("br", "", null, [], historyEl);
                    createEl("br", "", null, [], historyEl);
                }
            }
            if (data.aligulac.history.objects.length > 4) history += `...truncated...<br><a href="http://aligulac.com/results/search/?search=&players=${data.aligulac.history.objects[0].pla.tag}+${data.aligulac.history.objects[0].pla.id}%0D%0A${data.aligulac.history.objects[0].plb.tag}+${data.aligulac.history.objects[0].plb.id}&event=&bestof=all&offline=both&game=all" rel="noopener noreferrer" target="_blank">Click here for full history.</a>`;
        }
    }else{
        loadingEl.textContent = "Stream OFFLINE";
    }
}

let update = async function(){
    let options = {
        method: "GET",
        cache: "no-cache",
        mode: "cors",
        headers: {
          "X-SCVODEXT": "true"
        },
        referrerPolicy: "no-referrer",
    }
    fetch("https://starcraftvods.com/data/stream.json", options)
        .then(res => res.json())
        .then(stream => {
            updatePanel(stream);
        })
        .catch(err => {
            updatePanel({ error: err })
        });
}

let createEl = function(elType, content, attr, classes, parent, pre = false){
    let el = document.createElement(elType);
    el.textContent = content;
    if (classes.length > 0){
        for (let c = 0; c < classes.length; c++){
            el.classList.add(classes[c]);
        }
    }
    if (attr !== null){
        for (a in attr){
            el.setAttribute(a, attr[a]);
        }
    }
    pre ? parent.prepend(el) : parent.appendChild(el);
}

window.addEventListener("DOMContentLoaded", (e) => {
    chrome.storage.sync.get((o) => {
        console.log(o.options);
        if (o.options){
            Boolean(o.options.playerInfo) ? null : playerEl.forEach((e) => { return e.style.display = "none" });
            Boolean(o.options.thumbnail) ? null : thumbnailEl.style.display = "none";
            Boolean(o.options.aligulac) ? null : document.querySelector(".item.history").style.display = "none";
        }else{
            options = {
                thumbnail: true,
                aligulac: true,
                playerInfo: true
            }
            chrome.storage.sync.set({ options });
        }
    });
    update();
});

document.querySelector('#options').addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    }else{
        window.open(chrome.runtime.getURL("options.html"));
    }
});


