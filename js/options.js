let options = {};
let optionEls = document.querySelectorAll("input");

chrome.storage.sync.get("options", (data) => {
    console.log(data.options);
    if (data.options){
        for (o in data.options){
            document.querySelector(`#${o}`).checked = Boolean(data.options[o]);
        }
        Object.assign(options, data.options);
    }else{
    }
});

for (let o = 0; o < optionEls.length; o++){
    optionEls[o].addEventListener("change", (e) => {
        options[optionEls[o].id] = Boolean(optionEls[o].checked);
        chrome.storage.sync.set({ options });
        console.log(options);
    });
}